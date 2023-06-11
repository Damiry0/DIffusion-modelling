from DTO import VotersDTO


def parse_iterations(iterations: list):
    temp_list = []
    temp_list2 = []
    voters = VotersDTO()
    for key, value in iterations[0]['status'].items():  # Returns initial graph status
        if value == 1:
            data = {"key": str(key),
                    "value": str(value)
                    }
            temp_list.append(data)
    voters.initial_condition = temp_list
    for i in range(1, len(iterations)):
        # data = None
        for key, value in iterations[i]['status'].items():  # Returns subsequent iteration changes
            data = {"key": str(key),
                    "value": str(value)
                    }
            temp_list2.append(data)

    voters.iterations = temp_list2
    return voters
