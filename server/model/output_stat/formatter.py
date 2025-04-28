### aggregate lists

def rank_skills(skills):
    """
    Takes a list of skills, converts them to lowercase, and returns a dictionary with the skills as keys and their counts as values.
    """
    skill_counts = {}
    for skill in skills:
        skill_lower = skill.lower()  # Convert skill to lowercase
        if skill_lower in skill_counts:
            skill_counts[skill_lower] += 1
        else:
            skill_counts[skill_lower] = 1
            
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)

    sorted_skills = [
        {"skill": skill, "frequency": count} 
        for skill, count in sorted(
            skill_counts.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
    ]
    
    return sorted_skills