import random
import csv

# Function to generate random data
def generate_random_data(num_records):
    data = [["id", "longitude", "latitude", "temperature"]]
    
    for id in range(num_records):
        longitude = round(random.uniform(32, 44), 4)
        latitude = round(random.uniform(-5, 5), 4)
        temperature = round(random.uniform(0, 100), 1)
        data.append([id, longitude, latitude, temperature])
    
    return data

# Generate random data
num_records = 100  # Change this to the desired number of records
random_data = generate_random_data(num_records)

# Save data to a CSV file
csv_filename = "random_data.csv"

with open(csv_filename, mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(random_data)

print(f"Generated {num_records} records and saved to {csv_filename}")