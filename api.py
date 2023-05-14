import networkx as nx
import ndlib.models.ModelConfig as mc
import ndlib.models.opinions as op
from pyvis.network import Network

from typing import Union
from fastapi import FastAPI

app = FastAPI()


@app.get("/model")
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

g = nx.erdos_renyi_graph(1000, 0.1)

    # Model selection
model = op.VoterModel(g)
config = mc.Configuration()
config.add_model_parameter('fraction_infected', 0.1)

model.set_initial_status(config)

    # Simulation execution
iterations = model.iteration_bunch(200)
print(1)



# nt = Network('500px', '500px')
# # populates the nodes and edges data structures
# nt.from_nx(iterations)
# nt.show('nx.html')
