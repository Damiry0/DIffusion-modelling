import networkx as nx
import ndlib.models.ModelConfig as mc
import ndlib.models.opinions as op
from pyvis.network import Network

from typing import Union
from fastapi import FastAPI
from networkx.readwrite import json_graph
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/graphs")
async def graph_generation():
    g = nx.erdos_renyi_graph(100, 0.1)
    data = json_graph.node_link_data(g)
    return data

@app.get("/test-model")
async def model_simulation():
    g = nx.erdos_renyi_graph(1000, 0.1)

    # Model selection
    model = op.VoterModel(g)
    config = mc.Configuration()
    config.add_model_parameter('fraction_infected', 0.1)

    model.set_initial_status(config)

    # Simulation execution
    iterations = model.iteration_bunch(200)
    return iterations


@app.get("/graph-xxx")
async def graph_generation():
    g = nx.erdos_renyi_graph(1000, 0.1)
    nt = Network('500px', '500px')
    nt.from_nx(g)
    nt.toggle_physics(True)
    nt.show('nx.html')






# nt = Network('500px', '500px')
# # populates the nodes and edges data structures
# nt.from_nx(iterations)
# nt.show('nx.html')
