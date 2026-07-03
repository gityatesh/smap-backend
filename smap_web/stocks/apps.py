from django.apps import AppConfig
import os

class StocksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'stocks'
    
    def ready(self):
        if os.environ.get('RUN_MAIN'):  
            from . import updater
            updater.start_pipeline_scheduler()