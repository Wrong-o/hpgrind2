

def explanation(moment: str, difficulty: int = None):
    """_summary_
    Returns relevant part of formula sheet

    Args:
        moment (str): Question moment

    Returns:
        _type_: string
        explanation: LaTeX string 
    """

    if moment == "operations_order":
        return r"""
        \text[ Räkneordning} \\
        \text{1. Räkna ut det som står i paranteserna} \\
        \text{2. Räkna ut upphöjt i och roten ur} \\
        \text{3. Gånger och delat med} \\
        \text{4. Addition and subtraction}
        \text{Minnesregel: Om man ritar upp räkneordningen blir det en tjur med ett ärr över ögat}
        \text{(      ) }
        \text{  *   /  }
        \text{    +    }
        \text{    -    }
        """

    if moment == "fraction_equation":
        pass
