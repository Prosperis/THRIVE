#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["python-dotenv", "exa-py", "rich"]
# ///

import os
from datetime import datetime, timezone, timedelta

from rich.columns import Columns
from rich.console import Console
from rich.markdown import Markdown
from dotenv import load_dotenv
from exa_py import Exa


load_dotenv()
exa = Exa(os.getenv("EXA_API_KEY"))
console = Console()


def main():
    after_date = (datetime.now(timezone.utc) - timedelta(days=60)).date().isoformat()
    results = exa.search(
        "job application Software engineer backend python",
        type="auto",
        user_location="US",
        num_results=100,
        include_domains=[
            "jobs.ashbyhq.com",
            "jobs.lever.co",
            "job-boards.greenhouse.io",
            "boards.greenhouse.io",
            "myworkdayjobs.com",
            "workable.com",
            "hire.withgoogle.com",
            "hire.jobvite.com",
            "jobs.smartrecruiters.com",
            "bamboohr.com",
        ],
        start_published_date=after_date,
        include_text=["engineer python"],
        contents=dict(
            text=True,
            livecrawl="preferred",
            summary=dict(
                query=(
                    "Please Summarize the job posting in a few bulletpoints: "
                    "First bullet should use this template:`job title @ company name [location if available] [work policy (remote, hybrid, onsite, unknown)]`."
                    "Second bullet should describe the compensation details if possible including salary, salary ranges or bands, equity, bonuses, benefits, perks, etc. If no compensation details are available, please state `compensation details not provided`."
                    "Third bullet point should contain a company overview, their core product(s), year founded, estimated number of employees, and company website url."
                    "Fourth bullet should outline the specific languages, frameworks, technologies, databases, services, platforms, etc required for the role along with experience qualifiers when available.  Each entry should contain the name of the language/technology/.. Ex: `python`, `postgres` followed by years of experience needed.  Each item should follow this template: `<language/technology> 5+ yoe` and multiple items should be comma seperated. Example: `Python 5+ yoe, Typescript 3+ yoe, FastAPI 5+ yoe, React, Postgres 5+ yoe, Redis, AWS 3+ yoe, Docker, Kubernetes, ReST APIs, GraphQL, Datadog, Twilio`"
                    "Fifth bullet should contain links to the company website, careers page, any social links such as linkedin, twitter/X, Instagram, etc."
                    "The Remaining bullet points should contain all of the key qualifications, requirements, and responsibilities found in the job posting.  Examples: `Solid experience as a backend engineer with exposure to developing services, Docker/Kubernetes and REST APIs within a microservices architecture.`, `Strong fundamentals in distributed systems design and development with knowledge of cloud deployment architecture (AWS/GCP)`, `Strong proficiency in Python with years of experience putting solutions into production and maintaining them`, `some experience in Java or ability to upskill`, `Strong knowledge of DevOps practices, including CI/CD, provisioning and managing infrastructure (Terraform, Kubernetes, CI/CD pipelines, Kafka operations)`, `Foundational knowledge of relational and distributed database technologies`, `xperience applying AI/ML concepts and technology, particularly LLMs to solve business problems as well as staying on top of latest developments and trends in the AI industry.`, `Product-first mindset and a desire to design and build tools that solve real user problems.`, `Mastery of fundamental software engineering practices like good design documentation, unit testing, peer code reviews, and a preference for agile methods.`"
                    "whenever using markdown bold markup for emphasis in the bulletpoints, please do not markup the entire bulletpoint.  Reserve emphasis markup for short descriptive labels appearing at the beginning of a bullet points text.  Examples:  `**Company Overview:**`, `**Compensation:**`, `**Links**`, `**Required technologies:**`, `**Job Requirements:**`"
                )
            ),
            extras=dict(links=6),
        ),
    )
    parsed = [
        dict(
            title=result.title,
            url=result.url,
            published_date=result.published_date,
            summary=result.summary,
            # text=result.text,
        )
        for result in results.results
    ]

    for res in parsed:
        with console.pager():
            console.print(
                Columns(
                    [
                        res[key]
                        for key in sorted(res.keys())
                        if key not in ("summary", "published_date")
                    ],
                    expand=True,
                )
            )
            console.print(Markdown(res["summary"]))
            console.line()


if __name__ == "__main__":
    main()
