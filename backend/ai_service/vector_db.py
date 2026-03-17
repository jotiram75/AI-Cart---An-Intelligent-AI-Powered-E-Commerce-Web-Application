import faiss
import numpy as np
import os
import json

class VectorDB:
    def __init__(self, index_path="products.index", id_map_path="product_ids.json", dimension=2048):
        self.index_path = index_path
        self.id_map_path = id_map_path
        self.dimension = dimension
        self.id_map = []
        
        if os.path.exists(index_path):
            self.index = faiss.read_index(index_path)
            if os.path.exists(id_map_path):
                with open(id_map_path, 'r') as f:
                    self.id_map = json.load(f)
        else:
            # IndexFlatIP is for inner product (cosine similarity on normalized vectors)
            self.index = faiss.IndexFlatIP(dimension)
            
    def add_vectors(self, vectors, product_ids):
        vectors = np.array(vectors).astype('float32')
        self.index.add(vectors)
        self.id_map.extend(product_ids)
        self.save()
        
    def search(self, vector, top_k=10):
        vector = np.array([vector]).astype('float32')
        distances, indices = self.index.search(vector, top_k)
        
        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if idx != -1 and idx < len(self.id_map):
                results.append({
                    "product_id": self.id_map[idx],
                    "score": float(distances[0][i])
                })
        return results
    
    def save(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.id_map_path, 'w') as f:
            json.dump(self.id_map, f)
            
    def clear(self):
        self.index = faiss.IndexFlatIP(self.dimension)
        self.id_map = []
        if os.path.exists(self.index_path):
            os.remove(self.index_path)
        if os.path.exists(self.id_map_path):
            os.remove(self.id_map_path)
