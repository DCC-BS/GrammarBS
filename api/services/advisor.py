from typing import List, final

import dspy  # type: ignore
from pydantic import BaseModel

from models.text_rewrite_models import TextRewriteOptions
from utils.configuration import config
from utils.either import Either, right


class ProposeChanges(dspy.Signature):
    """
    Propose changes to the text.
    """

    newText: str = dspy.OutputField(desc="The corrected text")
    description: str = dspy.OutputField(desc="A description of the changes made to the text")


# Readability
# Calculate and display a readability score (e.g., Flesch-Kincaid Grade Level)40.
# Offer suggestions to improve readability if necessary.
# Formality
# Assess how well the text matches the desired formality level21.
# Suggest changes to align the text with the specified formality.
# Domain Relevance
# Evaluate how well the text fits the specified domain53.
# Highlight any terms or concepts that may need adjustment to better suit the domain.
# Coherence and Structure
# Analyze the logical flow and consistency of ideas in the text47.
# Suggest improvements for paragraph structure and transitions.


class AdvisorInfo(dspy.Signature):
    """
    Give advice on how to improve the text. Return a summary of the quality of the text and a list of proposed changes.
    """

    text: str = dspy.InputField(desc="The text to inspect")
    formality: str = dspy.InputField(desc="The formality to use for the rewritten text")
    domain: str = dspy.InputField(desc="The domain the use for the rewritten text")

    formalityScore: float = dspy.OutputField(
        desc="Assess how well the text matches the desired formality level. The formality score of the text normalized to a scale of 0 to 1"
    )
    domainScore: float = dspy.OutputField(
        desc="Evaluate how well the text fits the specified domain. The domain score of the text normalized to a scale of 0 to 1"
    )

    coherenceAndStructure: float = dspy.OutputField(
        desc="Analyze the logical flow and consistency of ideas in the text. The coherence and structure score of the text normalized to a scale of 0 to 1"
    )

    proposedChanges: str = dspy.OutputField(
        desc="Proposed changes to the text, answer in the language of the original text and format it with markdown."
    )


class AdvisorOutput(BaseModel):
    formalityScore: float
    domainScore: float
    coherenceAndStructure: float
    proposedChanges: str


@final
class AdvisorService:
    def __init__(self) -> None:
        lm = dspy.LM(
            model="hosted_vllm/Qwen/Qwen2.5-32B-Instruct-GPTQ-Int4",
            api_base=config.openai_api_base_url,
            api_key=config.openai_api_key,
            max_tokens=1000,
            temperature=0.2,
        )
        dspy.configure(lm=lm)

    def advise_changes(self, text: str, options: TextRewriteOptions) -> Either[str, AdvisorOutput]:
        """Corrects the input text based on given options."""

        module = dspy.Predict(AdvisorInfo)
        response = module(text=text, domain=options.domain, formality=options.formality)

        return right(
            AdvisorOutput(
                formalityScore=response.formalityScore,
                domainScore=response.domainScore,
                coherenceAndStructure=response.coherenceAndStructure,
                proposedChanges=response.proposedChanges,
            )
        )
