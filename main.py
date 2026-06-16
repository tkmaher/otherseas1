from datetime import datetime, timezone
import requests
from collections import deque

wale_latitude = 39.763342
wale_longitude = -0.638769

wale_schedule_from = 6 # 6AM
wale_schedule_to = 20 # 8PM

example_url = 'https://api.sunrise-sunset.org/json'

retry_amt = 3

def main():
    total_time = 0
    date_queue = deque()
    for i in range(1,32):
        date_queue.append([i, 0])
    while len(date_queue) > 0:
        [day, retries] = date_queue.popleft()
        start_time = datetime(2026, 12, day, wale_schedule_from, 0, tzinfo=timezone.utc)
        end_time = datetime(2026, 12, day, wale_schedule_to, 0, tzinfo=timezone.utc)
        try:
            response = requests.get(example_url, params={
                "lat": wale_latitude,
                "lng": wale_longitude,
                "date": f"2026-12-{day}",
                "formatted": 0
            })
            response.raise_for_status()
            res = response.json()
            print(res)
            morning_diff = datetime.fromisoformat(res['results']['sunrise']) - start_time
            evening_diff = end_time - datetime.fromisoformat(res['results']['sunset'])
            total_time += max(morning_diff.total_seconds() / 3600, 0)
            total_time += max(evening_diff.total_seconds() / 3600, 0)
        except Exception as err:
            print(f"Sunrise API raised error for day {day}: {err}")
            if retries < retry_amt:
                date_queue.append([day, retries + 1])
    print(total_time)
    return total_time

main()