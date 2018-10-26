ArrayList<Streamer> streamers;
color initColor;
float initRadius, initX, initY;

void setup() {
  colorMode(HSB);
  size(600, 400);
  background(255);
  frameRate(10);
  noStroke();
  streamers = new ArrayList<Streamer>();
  initColor = #D70040;
  initRadius = 10.0;
  initX = width/2.0;
  initY = height/2.0;
}

void draw() {
  background(255);
  streamers.add(new Streamer(initRadius, initColor, initX, initY));
  
  for (int i = 0; i < streamers.size(); i++)
    if (streamers.get(i).alive == true)
      streamers.get(i).display();
    else
      streamers.remove(i);
  
  initRadius += floor(random(-1,2));
  initColor += 10;
  
  initX += 2.0 * cos(floor(random(360)));
  initY += 2.0 * sin(floor(random(360)));
  
  if (initRadius < 1)
    initRadius = 1;
}

class Streamer {

  float x;
  float y;
  float r;
  color c;
  boolean alive;
  
  Streamer(float r, color c, float x, float y) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.alive = true;
  }

  void display() {
    fill(this.c);
    ellipse(this.x, this.y, this.r, this.r);
    this.update();
  }
  
  void update() {
    this.r += 3.0;
    
    if (this.r > 80.0)
      this.alive = false;
  }
}