/**
 * Created with JetBrains WebStorm.
 * User: exodia
 * Date: 13-4-5
 * Time: 下午2:04
 * To change this template use File | Settings | File Templates.
 */

//short cut
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

//30pixel 为现实的1米
var scale = 30;

//重力系数
var gravity = new b2Vec2(0, 9.8);

//允许睡眠
var allowSleep = true;
var world = new b2World(gravity, allowSleep);

function createFloor() {
    //创建刚体定义数据对象
    var bodyDef = new b2BodyDef;
    //为静态刚体, 即不受碰撞影响
    bodyDef.type = b2Body.b2_staticBody;
    //刚体原点位置, 根据测试,应该是中心位置
    bodyDef.position.x = 640 / 2 / scale;
    bodyDef.position.y = 470 / scale;

    //创建设备定义数据对象
    var fixtureDef = new b2FixtureDef;
    //密度
    fixtureDef.density = 1.0;
    //摩擦
    fixtureDef.friction = 0.5;
    //恢复系数
    fixtureDef.restitution = 0.2;
    //设备形状为多边形
    fixtureDef.shape = new b2PolygonShape;
    //设置为矩形
    fixtureDef.shape.SetAsBox(320 / scale, 10 / scale); //640 pixels wide and 20 pixels tall

    //世界创建刚体, 刚体创建设备, 设备拥有形状
    var body = world.CreateBody(bodyDef);
    var fixture = body.CreateFixture(fixtureDef);
}

function createRectangularBody() {
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 40 / scale;
    bodyDef.position.y = 100 / scale;
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.3;
    fixtureDef.shape = new b2PolygonShape;
    fixtureDef.shape.SetAsBox(30 / scale, 50 / scale);
    var body = world.CreateBody(bodyDef);
    var fixture = body.CreateFixture(fixtureDef);
}

function createCircularBody() {
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 130 / scale;
    bodyDef.position.y = 100 / scale;
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.7;
    fixtureDef.shape = new b2CircleShape(30 / scale);
    var body = world.CreateBody(bodyDef);
    var fixture = body.CreateFixture(fixtureDef);
}

function createSimplePolygonBody() {
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 230 / scale;
    bodyDef.position.y = 50 / scale;
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.2;
    fixtureDef.shape = new b2PolygonShape;
    // Create an array of b2Vec2 points in clockwise direction
    var points = [
        new b2Vec2(0, 0),
        new b2Vec2(40 / scale, 50 / scale),
        new b2Vec2(50 / scale, 100 / scale),
        new b2Vec2(-50 / scale, 100 / scale),
        new b2Vec2(-40 / scale, 50 / scale),
    ];
    // Use SetAsArray to define the shape using the points array
    fixtureDef.shape.SetAsArray(points, points.length);
    var body = world.CreateBody(bodyDef);
    var fixture = body.CreateFixture(fixtureDef);
}

function createComplexBody() {
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody;
    bodyDef.position.x = 350 / scale;
    bodyDef.position.y = 50 / scale;
    var body = world.CreateBody(bodyDef);
    //Create first fixture and attach a circular shape to the body
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.7;
    fixtureDef.shape = new b2CircleShape(40 / scale);
    body.CreateFixture(fixtureDef);
    // Create second fixture and attach a polygon shape to the body
    fixtureDef.shape = new b2PolygonShape;
    var points = [
        new b2Vec2(0, 0),
        new b2Vec2(40 / scale, 50 / scale),
        new b2Vec2(50 / scale, 100 / scale),
        new b2Vec2(-50 / scale, 100 / scale),
        new b2Vec2(-40 / scale, 50 / scale),
    ];
    fixtureDef.shape.SetAsArray(points, points.length);
    body.CreateFixture(fixtureDef);
}

function createRevoluteJoint() {
    //Define the first body
    var bodyDef1 = new b2BodyDef;
    bodyDef1.type = b2Body.b2_dynamicBody;
    bodyDef1.position.x = 480 / scale;
    bodyDef1.position.y = 50 / scale;
    var body1 = world.CreateBody(bodyDef1);
    //Create first fixture and attach a rectangular shape to the body
    var fixtureDef1 = new b2FixtureDef;
    fixtureDef1.density = 1.0;
    fixtureDef1.friction = 0.5;
    fixtureDef1.restitution = 0.5;
    fixtureDef1.shape = new b2PolygonShape;
    fixtureDef1.shape.SetAsBox(50 / scale, 10 / scale);
    body1.CreateFixture(fixtureDef1);
    // Define the second body
    var bodyDef2 = new b2BodyDef;
    bodyDef2.type = b2Body.b2_dynamicBody;
    bodyDef2.position.x = 470 / scale;
    bodyDef2.position.y = 50 / scale;
    var body2 = world.CreateBody(bodyDef2);
    //Create second fixture and attach a polygon shape to the body
    var fixtureDef2 = new b2FixtureDef;
    fixtureDef2.density = 1.0;
    fixtureDef2.friction = 0.5;
    fixtureDef2.restitution = 0.5;
    fixtureDef2.shape = new b2PolygonShape;
    var points = [
        new b2Vec2(0, 0),
        new b2Vec2(40 / scale, 50 / scale),
        new b2Vec2(50 / scale, 100 / scale),
        new b2Vec2(-50 / scale, 100 / scale),
        new b2Vec2(-40 / scale, 50 / scale),
    ];
    fixtureDef2.shape.SetAsArray(points, points.length);
    body2.CreateFixture(fixtureDef2);
    // Create a joint between body1 and body2
    var jointDef = new b2RevoluteJointDef;
    var jointCenter = new b2Vec2(470 / scale, 50 / scale);
    jointDef.Initialize(body1, body2, jointCenter);
    world.CreateJoint(jointDef);
}


function setupDebugDraw() {
    var context = document.getElementById('canvas').getContext('2d');
    var debugDraw = new b2DebugDraw();
    // Use this canvas context for drawing the debugging screen
    debugDraw.SetSprite(context);
    // Set the scale
    debugDraw.SetDrawScale(scale);
    // Fill boxes with an alpha transparency of 0.3
    debugDraw.SetFillAlpha(0.3);
    // Draw lines with a thickness of 1
    debugDraw.SetLineThickness(1.0);
    // Display all shapes and joints
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    // Start using debug draw in our world
    world.SetDebugDraw(debugDraw);
}

var timeStep = 1 / 60;
//设置速度约束求解器的迭代次数, 位置约束求解器迭代次数. 根据Box2d的文档, 8和3是建议的数值.
var velocityIterations = 8;
var positionIterations = 3;
function animate() {
    world.Step(timeStep, velocityIterations, positionIterations);
    world.ClearForces();
    world.DrawDebugData();
    setTimeout(animate, timeStep);
}

window.onload = function () {
    createFloor();
    createRectangularBody();
    createCircularBody();
    createSimplePolygonBody();
    createComplexBody();
    createRevoluteJoint();
    setupDebugDraw();
    animate();
};
