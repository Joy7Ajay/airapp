from transformers import pipeline

def generate_insights(kpi_data):
    """Generate natural language insights from KPIs"""
    # Prepare prompt
    prompt = f"""
    Generate a business insight report based on airport KPIs:
    - Total passengers: {kpi_data['passengers']}
    - Top airline: {kpi_data['top_airline']} ({kpi_data['airline_share']}% share)
    - Top destination: {kpi_data['top_destination']}
    - Total revenue: ${kpi_data['revenue']/1000000:.2f}M
    - Growth vs previous period: {kpi_data['growth']}%
    
    Highlight key trends and recommendations.
    """
    
    # Generate text with GPT-2
    generator = pipeline('text-generation', model='gpt2-medium')
    report = generator(
        prompt,
        max_length=300,
        num_return_sequences=1,
        temperature=0.7
    )
    
    return report[0]['generated_text']