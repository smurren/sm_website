

int cycle;
ArrayList<Stalk> stalks;

class Stalk {
  float stalkLength, stalkWidth, x, y, theta, dTheta, stalkColor, dStalkColor;
  float startLength, startWidth, dWidth, reverseDirectionRange, ballPercentage;
  
  Stalk(float newLength, float newDiameter, float newX, float newY) {
    this.stalkLength = newLength;
    this.stalkWidth = newDiameter;
    this.x = newX;
    this.y = newY;
    this.theta = PI/2.0;
    this.dTheta = 1/(300*PI);
    this.stalkColor = 0.0;
    this.dStalkColor = (255.0 / newLength) * 1.33;
    
    this.startLength = this.stalkLength;
    this.startWidth = this.stalkWidth;
    this.dWidth = this.stalkWidth / this.startLength;
    this.reverseDirectionRange = startLength / 8.0;
  } 
   
  void grow() {
    
    if (this.stalkLength > 2.0) {
      if (this.stalkColor > 255.0)
        this.stalkColor = 255.0;
      
      stroke(this.stalkColor,this.stalkColor,this.stalkColor,80);
      strokeWeight(this.stalkWidth);
      line(this.x, this.y, this.x + 1 * cos(this.theta), this.y + 1 * sin(this.theta));
      this.x = this.x + 1 * cos(this.theta);
      this.y = this.y - 1 * sin(this.theta);
      this.theta += random(this.dTheta);
      this.dTheta += this.dTheta * 19.0 / (PI * this.startLength);
      this.stalkLength--;
      this.stalkWidth -= this.dWidth;
      
      if (random(this.reverseDirectionRange) <= 1.0)
        this.dTheta *= -1;
      
      ballPercentage = 1.0 / (this.stalkLength / this.startLength);
      
      if (random(125) + 1 <= this.ballPercentage)
        addGlowBall(this.startWidth);
      
      if (this.stalkColor < 255.0)
        this.stalkColor += this.dStalkColor;
    }
    
  }
  
  void addGlowBall(float distance) {
    
    noStroke();
    
    float r = random(256);
    float g = random(256);
    float b = random(256);
    
    while (r <= 254.0 && g <= 254.0 && b <= 254.0) {
      r += 1.0;
      g += 1.0;
      b += 1.0;
    }
   
    float radius = distance / 2.0;
    
    distance = distance * random(1,3);
    float ballTheta = random(2*PI);
    
    float alpha = .75;
    int dI = 10;
    for (int i = 40; i > 0; i-=dI) {
      fill(r,g,b,alpha);
      ellipse(this.x + distance * cos(ballTheta), 
              this.y + distance * sin(ballTheta), radius+i, radius+i);
      alpha *= 1.1;
      if (dI >= 2)
        dI /= 2;
    }
    fill(r,g,b,200);
    ellipse(this.x + distance * cos(ballTheta), 
            this.y + distance * sin(ballTheta), radius, radius);
    
    stroke(255);
  }
 
}

void setup() {
  size(1000,750); //size(2880,1620);  //size(3840,2160);  //size(1920,1080);
  background(0);
  ellipseMode(CENTER);  // for drawing glowball 'flowers'
  cycle = 0;
  stalks = new ArrayList<Stalk>();
}

void draw() {
  frameRate(40);
  
  if (cycle == 0) {
    int stalkCount = 18;
    float stalkHeight = 1000.0;
    float stalkDiameter = 20.0;
    float x = width/2.0;
    float y = height;
    
    // Draw hairs (stalks)
    for (int i = 0; i < stalkCount; i++) {
      stalks.add(new Stalk(stalkHeight, stalkDiameter, x, y));
    }
    cycle += 1;
  }
  cycle += 1;
  
  // DECIDE WHEN TO CREATE NEW STALKS, BE ABLE TO SET ANGLE
  // AND LENGTH/DIAMETER BASED ON PARENT STALK
  
  for (Stalk stalk : stalks)
    stalk.grow();
}

