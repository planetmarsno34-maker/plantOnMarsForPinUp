const int sendPin = 4;     
const int receivePin = 2;  

void setup() {
  Serial.begin(9600); 
  pinMode(sendPin, OUTPUT);
  pinMode(receivePin, INPUT);
}

void loop() {

  long total = 0;
  
 
  for (int i = 0; i < 10; i++) {
    digitalWrite(sendPin, HIGH);
    long start = micros();
    while (digitalRead(receivePin) == LOW && micros() - start < 10000);
    total += micros() - start;
    digitalWrite(sendPin, LOW);
    delayMicroseconds(100);
  }

  Serial.println(total);

  delay(30); 
}