import requests
import Adafruit_BBIO.GPIO as GPIO
import time
import string
import random

GPIO.setup("P9_15", GPIO.IN)

old_switch_state = 0

def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

while True:
    new_switch_state = GPIO.input("P9_15")
    if new_switch_state == 1 and old_switch_state == 0:
        r = requests.post('http://sayadev.com:2000/list', data={'text':id_generator()})
        print(r.status_code, r.reason)
        time.sleep(0.1)
    old_switch_state = new_switch_state