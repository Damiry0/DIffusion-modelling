import ndlib.models.ModelConfig as mc
import ndlib.models.opinions as op
import networkx as nx
import uvicorn
from fastapi import FastAPI
from networkx.readwrite import json_graph
from starlette.middleware.cors import CORSMiddleware

from ModelParams import UpdatedModelParams
from iterations import parse_iterations

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


@app.post("/voter")
async def voter_model(params: UpdatedModelParams):
    g = json_graph.node_link_graph(params.data)

    # Model selection
    model = op.VoterModel(g)
    config = mc.Configuration()
    config.add_model_parameter('fraction_infected', params.initial_fraction)

    model.set_initial_status(config)

    # Simulation execution

    iters = model.iteration_bunch(params.iterations)
    iters = parse_iterations(iters)
    return iters


@app.post("/qvoter")
async def qvoter_model(params: UpdatedModelParams):
    g = json_graph.node_link_graph(params.data)

    # Model selection
    model = op.QVoterModel(g)
    config = mc.Configuration()
    config.add_model_parameter("q", params.q)
    config.add_model_parameter('fraction_infected', params.initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(params.iterations)


@app.post("/majority-rule")
async def majority_rule_model(params: UpdatedModelParams):
    g = json_graph.node_link_graph(params.data)

    # Model selection
    model = op.MajorityRuleModel(g)
    config = mc.Configuration()
    config.add_model_parameter("q", params.q)
    config.add_model_parameter('fraction_infected', params.initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(params.iterations)


@app.post("/sznajd")
async def sznajd_model(params: UpdatedModelParams):
    g = json_graph.node_link_graph(params.data)

    # Model selection
    model = op.SznajdModel(g)
    config = mc.Configuration()
    config.add_model_parameter('fraction_infected', params.initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(params.iterations)


@app.post("/cod")
async def cod_model(params: UpdatedModelParams):
    g = json_graph.node_link_graph(params.data)

    model = op.CognitiveOpDynModel(g)

    # Model Configuration
    config = mc.Configuration()
    config.add_model_parameter("I", params.i)
    config.add_model_parameter("B_range_min", params.b_min)
    config.add_model_parameter("B_range_max", params.b_max)
    config.add_model_parameter("T_range_min", params.t_min)
    config.add_model_parameter("T_range_max", params.t_max)
    config.add_model_parameter("R_fraction_negative", params.r_negative)
    config.add_model_parameter("R_fraction_neutral", params.r_neutral)
    config.add_model_parameter("R_fraction_positive", params.r_positive)
    config.add_model_parameter('fraction_infected', params.initial_fraction)
    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(params.iterations)


@app.post("/bias")
async def algorithm_bias_model(params: UpdatedModelParams):
    g = json_graph.node_link_graph(params.data)

    # Model selection
    model = op.AlgorithmicBiasModel(g)
    config = mc.Configuration()
    config.add_model_parameter("epsilon", params.epsilion)
    config.add_model_parameter("gamma", params.gamma)
    config.add_model_parameter('fraction_infected', params.initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(params.iterations)


@app.post("/hegselmann")
async def hegselmann_krause_model(params: UpdatedModelParams):
    g = json_graph.node_link_graph(params.data)

    # Model selection
    model = op.HKModel(g)
    config = mc.Configuration()
    config.add_model_parameter("epsilon", params.epsilion)
    config.add_model_parameter('fraction_infected', params.initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(params.iterations)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)