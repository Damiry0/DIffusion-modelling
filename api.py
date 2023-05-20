import ndlib.models.ModelConfig as mc
import ndlib.models.opinions as op
import networkx as nx
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


@app.get("/voter")
async def voter_model(data, q):
    g = json_graph.node_link_graph(data);

    # Model selection
    model = op.VoterModel(g)
    config = mc.Configuration()
    config.add_model_parameter('fraction_infected', q)

    model.set_initial_status(config)

    # Simulation execution
    iterations = model.iteration_bunch(200)
    return iterations


@app.get("/voter")
async def voter_model(data, initial_fraction, iterations):
    g = json_graph.node_link_graph(data)

    # Model selection
    model = op.VoterModel(g)
    config = mc.Configuration()
    config.add_model_parameter('fraction_infected', initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(iterations)


@app.get("/qvoter")
async def qvoter_model(data, initial_fraction, iterations, q):
    g = json_graph.node_link_graph(data)

    # Model selection
    model = op.QVoterModel(g)
    config = mc.Configuration()
    config.add_model_parameter("q", q)
    config.add_model_parameter('fraction_infected', initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(iterations)


@app.get("/majority-rule")
async def majority_rule_model(data, initial_fraction, iterations, q):
    g = json_graph.node_link_graph(data)

    # Model selection
    model = op.MajorityRuleModel(g)
    config = mc.Configuration()
    config.add_model_parameter("q", q)
    config.add_model_parameter('fraction_infected', initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(iterations)


@app.get("/sznajd")
async def sznajd_model(data, initial_fraction, iterations):
    g = json_graph.node_link_graph(data)

    # Model selection
    model = op.SznajdModel(g)
    config = mc.Configuration()
    config.add_model_parameter('fraction_infected', initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(iterations)


@app.get("/cod")
async def cod_model(data, initial_fraction, iterations, i=0.15, b_min=0, b_max=1, t_min=0, t_max=1,
                    r_negative=1.0 / 3, r_neutral=1.0 / 3, r_positive=1.0 / 3):
    g = json_graph.node_link_graph(data)

    model = op.CognitiveOpDynModel(g)

    # Model Configuration
    config = mc.Configuration()
    config.add_model_parameter("I", i)
    config.add_model_parameter("B_range_min", b_min)
    config.add_model_parameter("B_range_max", b_max)
    config.add_model_parameter("T_range_min", t_min)
    config.add_model_parameter("T_range_max", t_max)
    config.add_model_parameter("R_fraction_negative", r_negative)
    config.add_model_parameter("R_fraction_neutral", r_neutral)
    config.add_model_parameter("R_fraction_positive", r_positive)
    config.add_model_parameter('fraction_infected', initial_fraction)
    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(iterations)


@app.get("/bias")
async def algorithm_bias_model(data, initial_fraction, iterations, epsilion=0.32, gamma=1):
    g = json_graph.node_link_graph(data)

    # Model selection
    model = op.AlgorithmicBiasModel(g)
    config = mc.Configuration()
    config.add_model_parameter("epsilon", epsilion)
    config.add_model_parameter("gamma", gamma)
    config.add_model_parameter('fraction_infected', initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(iterations)


@app.get("/hegselmann")
async def hegselmann_krause_model(data, initial_fraction, iterations, epsilion=0.32):
    g = json_graph.node_link_graph(data)

    # Model selection
    model = op.HKModel(g)
    config = mc.Configuration()
    config.add_model_parameter("epsilon", epsilion)
    config.add_model_parameter('fraction_infected', initial_fraction)

    model.set_initial_status(config)

    # Simulation execution
    return model.iteration_bunch(iterations)