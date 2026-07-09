from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import os
import sys
import subprocess
from django.conf import settings
from django.core.management import call_command

def run_etl_script():
    print('Running etl and enrichment pipeline....')
    try:
        call_command('run_etl')
        print('ETL pipeline successfully executed...')
        call_command('run_enrichment')
        print('Enrichment pipeline successfully executed...')
    except subprocess.CalledProcessError as e:
        print(f"ETL/Enrichment Pipeline crashed during execution : {e}\n")
    except Exception as e:
        print(f"[Schedular] failed to find or run the script: {e}\n")
    

def start_pipeline_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        run_etl_script,
        id = 'daily_market_scraping',
        trigger=CronTrigger(
            day_of_week='mon-fri',
            hour=18,
            minute=54
        )
    )
    
    scheduler.start()
    print('Data pipeline schedular started.........')