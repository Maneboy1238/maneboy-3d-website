import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
//CREATING OUR SCENE, CAMERA AND RENDERING 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(innerWidth, innerHeight);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.zIndex = 0;
renderer.domElement.style.top = 0;
renderer.domElement.style.left = 0;
document.body.appendChild(renderer.domElement);
//ADDING ORBITCONTROLS 
new OrbitControls(camera, renderer.domElement);
// USING DAT GUI FOR ADJUST MEANT TO THE WIDTH, HEIGHT E.T.C OF OUR PLANE
const gui = new dat.GUI();
const world = {

    plane: {
    width: 50,
    height: 50,
    widthSegments: 20,
    heightSegments: 20
   }
}
gui.add(world.plane, 'width', 1, 100).onChange(()=> {
    generatePlane();
    });
gui.add(world.plane, 'height', 1, 100).onChange(()=> {
    generatePlane();
    });
gui.add(world.plane, 'widthSegments', 1, 100).onChange(()=> {
    generatePlane();
    });
gui.add(world.plane, 'heightSegments', 1, 100).onChange(()=> {
    generatePlane();
    });
    
function generatePlane( ) {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
    const randomValues = [];
const {array} = planeMesh.geometry.attributes.position;
for(let i = 0; i < array.length; i++) {
    if (i % 3 && i + 2 < array.length) {
    const x = array[i];
    const y = array[i +1]
    const z = array[i + 2];
    array[i] = x + Math.random() - 0.5 * 0.5;
    array[i + 1] = y + (Math.random() - 0.5) * 0.5;
    array[i + 2] = z + (Math.random() - 0.5) * 0.5;
    }
    randomValues.push(Math.random() - 0.5 * 2)
}
 planeMesh.geometry.attributes.position.originalPosition = array.slice();
 planeMesh.geometry.attributes.position.randomValues = randomValues;
 planeMesh.position.set(0,0,0);
 planeMesh.rotation.x = 5;

//CREATING A NEW COLOR ATTRIBUTE IN OUR PLANEMESH GEOMETRY 
const colors = [];
const {count} = planeMesh.geometry.attributes.position
for (let i = 0; i < count; i++) {
    colors.push(0,0.19,0.4);
}
planeMesh.geometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(new Float32Array(colors), 3));

    
}

//CREATING OUR PLANEMESH
const planeMaterial = new THREE.MeshPhongMaterial({
    //color: 0xff0000,
    side: THREE.DoubleSide, 
    flatShading: true,
    vertexColors: true
});
const planeGeometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments);
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
//CREATING OUR LIGHT
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(0,20,1);
//CREATING OUR BACK LIGHT
const backLight = new THREE.DirectionalLight(0xffffff, 2);
backLight.position.set(0,0,-1);

scene.add(planeMesh, light, backLight);
//CREATING THE JAGGARDNESS OF OUR PLANE
const randomValues = [];
const {array} = planeMesh.geometry.attributes.position;
for(let i = 0; i < array.length; i++) {
    if (i % 3 && i + 2 < array.length) {
    const x = array[i];
    const y = array[i +1]
    const z = array[i + 2];
    array[i] = x + Math.random() - 0.5 * 0.5;
    array[i + 1] = y + (Math.random() - 0.5) * 0.5;
    array[i + 2] = z + (Math.random() - 0.5) * 0.5;
    }
    randomValues.push(Math.random() - 0.5 * 2)
}
 planeMesh.geometry.attributes.position.originalPosition = array.slice();
 planeMesh.geometry.attributes.position.randomValues = randomValues;
 planeMesh.position.set(0,0,0);
 planeMesh.rotation.x = 5;
const raycaster = new THREE.Raycaster();

camera.position.z = 20;
//CREATING A NEW COLOR ATTRIBUTE IN OUR PLANEMESH GEOMETRY 
const colors = [];
const {count} = planeMesh.geometry.attributes.position
for (let i = 0; i < count; i++) {
    colors.push(0,0.19,0.4);
}
planeMesh.geometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(new Float32Array(colors), 3));

const mouse = {
    x: undefined,
    y: undefined
};
let frame = 0;
function animate () {
    frame += 0.01
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //planeMesh.rotation.y += 0.01;    
    const {array, originalPosition, randomValues} = planeMesh.geometry.attributes.position
    for (let i = 0; i < array.length; i+=3) {
        array[i] =  originalPosition[i] + Math.cos(frame + randomValues[i]) * 2;
        array[i + 1] = originalPosition[i +1] + Math.sin(frame + randomValues[i + 1]) * 2;

    }
    planeMesh.geometry.attributes.position.needsUpdate = true
    //DETECTING MOUSE INTERACTION ON OUR PLANEMESH
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) { 
        const {color} = intersects[0].object.geometry.attributes;
        
        color.setX(intersects[0].face.a, 0.1);
        color.setX(intersects[0].face.b, 0.1);
        color.setX(intersects[0].face.c, 0.1);
        
        color.setY(intersects[0].face.a, 0.5)
        color.setY(intersects[0].face.b, 0.5)
        color.setY(intersects[0].face.c, 0.5)
        
        color.setZ(intersects[0].face.a, 1);
        color.setZ(intersects[0].face.b, 1);
        color.setZ(intersects[0].face.c, 1);
        const initialColor = {
        r:0,
        g:0.19,
        b:0.4
    }
    const hoverColor = {
        r:0.1,
        g:0.5,
        b:1
    }
    gsap.to(hoverColor, {
        r: initialColor.r,
        g:initialColor.g,
        b: initialColor.b,
        duration: 0.5,
        onUpdate: ()=> {
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setX(intersects[0].face.c, hoverColor.r)
        
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setY(intersects[0].face.c, hoverColor.g)
        
        color.setZ(intersects[0].face.a, hoverColor.b)
        color.setZ(intersects[0].face.b, hoverColor.b)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.needsUpdate = true;  
        }
    })
        color.needsUpdate = true;                                                                                                                                                                                            

    }
    
}
animate();
//ADDING EVENT LISTENR TO THE WINDOW AND NORMALISING OUR MOUSE CO-ORDINATES
addEventListener('mousemove', (e)=> {
    mouse.x = (e.clientX/innerWidth) * 2 -1;
    mouse.y = -(e.clientY/innerHeight) * 2 + 1; 
})
addEventListener('touchmove', e => {
    mouse.x = (e.touches[0].clientX/innerWidth) * 2 -1;
    mouse.y = -(e.touches[0].clientY/innerHeight) * 2 + 1; 
    
})
addEventListener('resize', ()=> {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
})
const button = document.querySelector('.btn');
button.addEventListener('touchstart', ()=> {
    button.classList.toggle('hover');
})

button.addEventListener('touchend', ()=> {
    button.classList.remove('hover');
})