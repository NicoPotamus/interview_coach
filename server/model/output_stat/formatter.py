### aggregate lists

def rank_skills(skills):
    """
    Takes a list of skills and returns a dictionary with the skills as keys and their counts as values.
    """
    skill_counts = {}
    for skill in skills:
        if skill in skill_counts:
            skill_counts[skill] += 1
        else:
            skill_counts[skill] = 1
    return skill_counts