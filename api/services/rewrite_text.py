# type: ignore

from typing import List, final

import dspy
from openai import OpenAI

from models.text_rewrite_models import RewriteResult, TextRewriteOptions
from utils.configuration import config
from utils.either import Either, right


class RewirteInfo(dspy.Signature):
    """
    Rewrite the text, return a list of options.
    """
    text: str = dspy.InputField(desc="The text to be rewritten")
    context: str = dspy.InputField(desc="The full text of the document, text to be rewritten is marked with <rewrite>")
    formality: str = dspy.InputField(desc="The formality to use for the rewritten text")
    domain: str = dspy.InputField(desc="The domain the use for the rewritten text")
    options: List[str] = dspy.OutputField(desc="The rewritten texts")


@final
class TextRewriteService:

    def __init__(self) -> None:

        lm = dspy.LM(model='hosted_vllm/Qwen/Qwen2.5-32B-Instruct-GPTQ-Int4', api_base=config.openai_api_base_url, api_key='', max_tokens=1000, temperature=0.2)
        dspy.configure(lm=lm)

        self.client = OpenAI(
            base_url=config.openai_api_base_url,
            api_key=config.openai_api_key
        )

    def rewrite_text(self, text: str, context: str, options: TextRewriteOptions) -> Either[str, RewriteResult]:
        """Corrects the input text based on given options.
        Returns Either[str, str] where:
        - Left(str) contains error message
        - Right(str) contains corrected text
        """

        module = dspy.Predict(RewirteInfo)
        response  = module(
            text=text,
            context=context,
            domain=options.domain,
            formality=options.formality)

        return right(RewriteResult(options=response.options))
