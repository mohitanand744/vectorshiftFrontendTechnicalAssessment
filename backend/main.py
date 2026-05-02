from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from collections import defaultdict, deque

app = FastAPI()

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {'status': 'healthy', 'message': 'VectorShift Backend API is running'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: dict = Body(...)):
    """
    Analyzes the pipeline structure.
    Returns the number of nodes, number of edges, and whether the graph is a DAG.
    """
    nodes = pipeline.get('nodes', [])
    edges = pipeline.get('edges', [])
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # DAG detection using Kahn's algorithm
    adj = defaultdict(list)
    in_degree = {node['id']: 0 for node in nodes}
    
    # Build adjacency list and calculate in-degrees
    for edge in edges:
        u = edge['source']
        v = edge['target']
        if u in in_degree and v in in_degree:
            adj[u].append(v)
            in_degree[v] += 1
        
    # Queue for nodes with no incoming edges
    queue = deque([u for u in in_degree if in_degree.get(u, 0) == 0])
    visited_count = 0
    
    while queue:
        u = queue.popleft()
        visited_count += 1
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
                
    # If visited_count equals total nodes, it's a DAG (no cycles)
    is_dag = visited_count == num_nodes
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }