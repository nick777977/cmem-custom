"""Packaged stdio adapter for the Windows local worker's derived Chroma index."""

import argparse
import hashlib
from importlib.metadata import version
import os
from pathlib import Path
import sys


ASSETS = {
    "model.onnx": "10f7a088420252b26caf819236ca2c9d2987afd0fc06fec7553b542a5655a05a",
    "tokenizer.json": "2c3387be76557bd40970cec13153b3bbf80407865484b209e655e5e4729076b8",
}
PACKAGES = {
    "chromadb": "1.5.9",
    "mcp": "1.26.0",
    "onnxruntime": "1.24.4",
    "tokenizers": "0.22.2",
}
ENCODER = "paraphrase-multilingual-MiniLM-L12-v2:e8f8c21:mean128-cosine:v1"


def deny_external_python_network(event, args):
    # Windows asyncio uses a loopback socket pair even for stdio.
    loopback = {"127.0.0.1", "::1"}
    if event in {"socket.connect", "socket.bind", "socket.sendto", "socket.sendmsg"}:
        address = args[-1]
        if isinstance(address, tuple) and address[0] in loopback:
            return
    elif event in {"socket.getaddrinfo", "socket.gethostbyname", "socket.gethostbyaddr"}:
        if args[0] in loopback:
            return
    else:
        return
    print("LOCAL_CHROMA_NETWORK_DENIED", file=sys.stderr)
    raise PermissionError("External Python networking is disabled for local Chroma")


def load_encoder(model_dir):
    for filename, expected in ASSETS.items():
        try:
            with (model_dir / filename).open("rb") as asset:
                actual = hashlib.file_digest(asset, "sha256").hexdigest()
        except OSError as exc:
            raise RuntimeError(f"Missing or unreadable local asset {filename}") from exc
        if actual != expected:
            raise RuntimeError(f"SHA-256 mismatch for {filename}")
    if sys.version_info[:3] != (3, 13, 15) or sys.prefix == sys.base_prefix:
        raise RuntimeError("Expected the prepared Python 3.13.15 virtual environment")
    for package, expected in PACKAGES.items():
        if version(package) != expected:
            raise RuntimeError(f"Expected {package}=={expected}")

    import numpy as np
    import onnxruntime as ort
    from tokenizers import Tokenizer

    ort.disable_telemetry_events()
    tokenizer = Tokenizer.from_file(str(model_dir / "tokenizer.json"))
    tokenizer.enable_truncation(max_length=128)
    tokenizer.enable_padding(pad_id=tokenizer.token_to_id("<pad>"), pad_token="<pad>")
    options = ort.SessionOptions()
    options.intra_op_num_threads = min(os.cpu_count() or 1, 4)
    session = ort.InferenceSession(
        str(model_dir / "model.onnx"), sess_options=options, providers=["CPUExecutionProvider"]
    )
    inputs = {item.name for item in session.get_inputs()}

    def embed(documents):
        vectors = []
        for start in range(0, len(documents), 16):
            encoded = tokenizer.encode_batch(documents[start:start + 16])
            mask = np.array([item.attention_mask for item in encoded], dtype=np.int64)
            features = {
                "input_ids": np.array([item.ids for item in encoded], dtype=np.int64),
                "attention_mask": mask,
                "token_type_ids": np.array([item.type_ids for item in encoded], dtype=np.int64),
            }
            hidden, = session.run(["last_hidden_state"], {key: features[key] for key in inputs})
            # Sentence Transformers' masked mean pooling, with cosine search in Chroma.
            weights = mask[:, :, None]
            pooled = (hidden * weights).sum(axis=1) / weights.sum(axis=1)
            vectors.extend(pooled.astype(np.float32).tolist())
        return vectors

    return embed


def build_server(data_dir, embed):
    import chromadb
    from chromadb.config import Settings
    from mcp.server.fastmcp import FastMCP

    client = chromadb.PersistentClient(
        path=str(data_dir),
        settings=Settings(
            _env_file=None, anonymized_telemetry=False, chroma_otel_granularity="none",
            chroma_otel_collection_endpoint="", allow_reset=False,
        ),
    )
    server = FastMCP("cmem-light-chroma")

    def checked(collection):
        if (collection.metadata or {}).get("cmem_encoder") != ENCODER:
            raise RuntimeError("Chroma collection has incompatible embedding metadata")
        return collection

    def collection(name):
        return checked(client.get_collection(name, embedding_function=None))

    @server.tool(structured_output=False)
    def chroma_create_collection(collection_name: str, embedding_function_name: str = "default"):
        if embedding_function_name != "default":
            raise ValueError("Only the packaged local embedding function is supported")
        checked(client.get_or_create_collection(
            collection_name, embedding_function=None,
            metadata={"cmem_encoder": ENCODER}, configuration={"hnsw": {"space": "cosine"}},
        ))
        return {"name": collection_name}

    @server.tool(structured_output=False)
    def chroma_list_collections(limit: int | None = None):
        return {"collections": [item.name for item in client.list_collections(limit=limit)]}

    @server.tool(structured_output=False)
    def chroma_get_collection_count(collection_name: str):
        return collection(collection_name).count()

    @server.tool(structured_output=False)
    def chroma_delete_collection(collection_name: str):
        collection(collection_name)
        client.delete_collection(collection_name)

    @server.tool(structured_output=False)
    def chroma_get_documents(
        collection_name: str, ids: list[str] | None = None, where: dict | None = None,
        limit: int | None = None, offset: int | None = None,
        include: list[str] | None = None,
    ):
        return collection(collection_name).get(
            ids=ids, where=where, limit=limit, offset=offset,
            include=["documents", "metadatas"] if include is None else include,
        )

    @server.tool(structured_output=False)
    def chroma_add_documents(collection_name: str, ids: list[str], documents: list[str], metadatas: list[dict]):
        target = collection(collection_name)
        # Signal collisions to the worker's existing update/add reconciliation.
        if target.get(ids=ids, include=[])["ids"]:
            raise ValueError("Some document IDs already exist")
        target.add(ids=ids, documents=documents, metadatas=metadatas, embeddings=embed(documents))

    @server.tool(structured_output=False)
    def chroma_update_documents(
        collection_name: str, ids: list[str], metadatas: list[dict],
        documents: list[str] | None = None,
    ):
        collection(collection_name).update(
            ids=ids, metadatas=metadatas, documents=documents,
            embeddings=embed(documents) if documents is not None else None,
        )

    @server.tool(structured_output=False)
    def chroma_delete_documents(collection_name: str, ids: list[str]):
        collection(collection_name).delete(ids=ids)

    @server.tool(structured_output=False)
    def chroma_query_documents(
        collection_name: str, query_texts: list[str], n_results: int,
        where: dict | None = None, include: list[str] | None = None,
    ):
        return collection(collection_name).query(
            query_embeddings=embed(query_texts), n_results=n_results, where=where,
            include=["documents", "metadatas", "distances"] if include is None else include,
        )

    return server


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-dir", required=True, type=Path)
    parser.add_argument("--data-dir", required=True, type=Path)
    args = parser.parse_args()
    os.environ.update(
        ANONYMIZED_TELEMETRY="False",
        OTEL_SDK_DISABLED="true",
        HF_HUB_OFFLINE="1",
        HF_HUB_DISABLE_TELEMETRY="1",
    )
    sys.addaudithook(deny_external_python_network)
    try:
        # Chroma also constructs default settings at import time. Keep their
        # implicit .env lookup inside the owned index directory.
        os.chdir(args.data_dir)
        server = build_server(args.data_dir, load_encoder(args.model_dir))
    except Exception as exc:
        print(f"LOCAL_CHROMA_SETUP_REQUIRED: {exc}", file=sys.stderr)
        return 1
    server.run(transport="stdio")
    return 0


if __name__ == "__main__":
    sys.exit(main())
