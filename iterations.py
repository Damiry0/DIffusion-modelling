class VotersDTO:
    """Base DTO class for Voter model based on return format of iterations"""
    initial_condition = list
    iterations = list


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
        for key, value in iterations[i]['status'].items():  # Retrurns subsequent iteration changes
            data = {"key": str(key),
                    "value": str(value)
                    }
            temp_list2.append(data)

    voters.iterations = temp_list2
    return voters
