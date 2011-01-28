package com.klock;

import java.util.Date;

import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Bundle;
import android.view.View;

public class Klock extends Activity {
	
	KlockView klockview;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        setContentView(R.layout.main);
        
        klockview = new KlockView(this);
        setContentView(klockview);
    }
    
    private class KlockView extends View {
    	public KlockView(final Context ctx) {
    		super(ctx);
    	}
    	
    	private class Point {
    		public double x;
    		public double y;
    		
    		public Point(final double x, final double y) {
    			this.x = x;
    			this.y = y;
    		}
    	}
    	
    	@Override
    	protected void onDraw(final Canvas c) {
    		Paint paint = new Paint();
    		paint.setStyle(Paint.Style.FILL);
    		paint.setAntiAlias(true);
    		paint.setColor(Color.DKGRAY);
    		int yCenter = getHeight() / 2;
    		int xCenter = getWidth() / 2;
    		c.translate(xCenter, yCenter);
    		c.drawPaint(paint);
    		Date now = new Date();
    		drawNumberRing(now, c);
    	}
    	
    	private void drawNumberRing(final Date now, final Canvas c) {
    		int h = now.getHours();
    		int currentNum = h;
    		for(int i = 1; i<=12; i++) {
    			c.save();
    			double currentAngle = (360/(12-1+1) * (i - currentNum));
    			Point p = radiansToPoint(45, currentAngle);
    			c.translate((float)p.x, (float)p.y);
    			double radAng = degToRad(currentAngle);
    			c.rotate((float)radAng);
    			drawNumber(i, c, p);
    			c.restore();
    		}
    	}
    	
    	private void drawNumber(final int number, final Canvas c, final Point p) {
    		Paint paint = new Paint();
    		paint.setStyle(Paint.Style.FILL);
    		paint.setStrokeWidth(1);
    		paint.setColor(Color.LTGRAY);
    		paint.setTextSize(30);
    		c.drawText(""+number, (float)p.x, (float)p.y, paint);
    	}
    	
    	private double degToRad(final double deg) {
    		return Math.PI * 2 * deg / 360;
    	}
    	
    	private Point radiansToPoint(final int radius, final double angle) {
    		double rads = degToRad(angle - 90);
    		double x = Math.sin(rads) * radius;
    		double y = Math.cos(rads) * radius;
     		return new Point(x, y);
    	}
    }
}