let camera, scene, renderer
let mesh

// 한 줄에 배치되는 카메라 수
const VIDEOAMOUNT = 6

init()
animate()

function init() {
  const ASPECT_RATIO = window.innerWidth / window.innerHeight
  const WIDTH = (window.innerWidth / VIDEOAMOUNT) * window.devicePixelRatio
  const HEIGHT = (window.innerHeight / VIDEOAMOUNT) * window.devicePixelRatio
  const cameras = []

  for (let y = 0; y < VIDEOAMOUNT; y++) {
    for (let x = 0; x < VIDEOAMOUNT; x++) {
      const subCamera = new THREE.PerspectiveCamera(40, ASPECT_RATIO, 0.1, 10)

      // The x, y, width, and height parameters of the viewport.
      subCamera.viewport = new THREE.Vector4(
        Math.floor(x * WIDTH),
        Math.floor(y * HEIGHT),
        Math.ceil(WIDTH),
        Math.ceil(HEIGHT)
      )
      subCamera.position.x = x / VIDEOAMOUNT - 0.5

      subCamera.position.y = 0.5 - y / VIDEOAMOUNT
      subCamera.position.z = 1.5
      console.log(subCamera.position)
      subCamera.position.multiplyScalar(2)
      subCamera.lookAt(0, 0, 0)
      subCamera.updateMatrixWorld()
      cameras.push(subCamera)
    }
  }

  camera = new THREE.ArrayCamera(cameras)
  camera.position.z = 3

  scene = new THREE.Scene()

  scene.add(new THREE.AmbientLight(0x222244))

  const light = new THREE.DirectionalLight()
  light.position.set(0.5, 0.5, 1)
  light.castShadow = true
  light.shadow.camera.zoom = 4 // tighter shadow map
  scene.add(light)

  // 평면 사각형
  const geometryBackground = new THREE.PlaneBufferGeometry(100, 100)

  // 광원이 있는 재질
  const materialBackground = new THREE.MeshPhongMaterial({ color: 0x000066 })

  const background = new THREE.Mesh(geometryBackground, materialBackground)
  background.receiveShadow = true
  background.position.set(0, 0, -1)
  scene.add(background)

  const geometyrCylinder = new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 32)
  const materialCylinder = new THREE.MeshPhongMaterial({ color: 0xff0000 })

  mesh = new THREE.Mesh(geometyrCylinder, materialCylinder)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  document.body.appendChild(renderer.domElement)

  window.addEventListener("resize", onWindowResize, false)
}

// 반응형 구현
function onWindowResize() {
  const ASPECT_RATIO = window.innerWidth / window.innerHeight
  const WIDTH = (window.innerWidth / VIDEOAMOUNT) * window.devicePixelRatio
  const HEIGHT = (window.innerHeight / VIDEOAMOUNT) * window.devicePixelRatio

  camera.aspect = ASPECT_RATIO
  camera.updateProjectionMatrix()
  for (let y = 0; y < VIDEOAMOUNT; y++) {
    for (let x = 0; x < VIDEOAMOUNT; x++) {
      const subcamera = camera.cameras[VIDEOAMOUNT * y + x]

      subcamera.viewport.set(
        Math.floor(x * WIDTH),
        Math.floor(y * HEIGHT),
        Math.ceil(WIDTH),
        Math.ceil(HEIGHT)
      )

      subcamera.aspect = ASPECT_RATIO
      subcamera.updateProjectionMatrix()
    }
  }

  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  mesh.rotation.x += 0.005
  mesh.rotation.z += 0.01

  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}
