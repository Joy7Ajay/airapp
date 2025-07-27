import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from statsmodels.tsa.arima.model import ARIMA
from prophet import Prophet

def predict_passengers(historical_data, period='week'):
    df = pd.DataFrame(historical_data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.set_index('timestamp').resample('D').sum()
    
    model_arima = ARIMA(df['passengers'], order=(5,1,0))
    model_fit = model_arima.fit()
    arima_forecast = model_fit.forecast(steps=7)
    
    prophet_df = df.reset_index().rename(columns={'timestamp': 'ds', 'passengers': 'y'})
    model_prophet = Prophet()
    model_prophet.fit(prophet_df)
    future = model_prophet.make_future_dataframe(periods=30)
    prophet_forecast = model_prophet.predict(future)
    
    combined = {
        'short_term': arima_forecast.tolist(),
        'long_term': prophet_forecast[['ds', 'yhat']].tail(30).to_dict('records')
    }
    return combined