const fs = require('fs');
const path = require('path');

// Simple OBJ to GLB converter using three.js
// This script reads OBJ files and creates a GLB file

const objPath = path.join(__dirname, '../public/images/camera/camera.obj');
const mtlPath = path.join(__dirname, '../public/images/camera/camera.mtl');
const outputPath = path.join(__dirname, '../public/models/camera.glb');

// Create models directory if it doesn't exist
const modelsDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Read OBJ file
const objContent = fs.readFileSync(objPath, 'utf8');
const mtlContent = fs.readFileSync(mtlPath, 'utf8');

// Parse OBJ content
function parseOBJ(content) {
  const vertices = [];
  const normals = [];
  const uvs = [];
  const faces = [];
  let currentGroup = 'default';
  let currentMaterial = '';

  const lines = content.split('\n');
  
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    
    switch (parts[0]) {
      case 'g':
        currentGroup = parts[1] || 'default';
        break;
      case 'usemtl':
        currentMaterial = parts[1] || '';
        break;
      case 'v':
        vertices.push([
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        ]);
        break;
      case 'vn':
        normals.push([
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        ]);
        break;
      case 'vt':
        uvs.push([
          parseFloat(parts[1]),
          parseFloat(parts[2])
        ]);
        break;
      case 'f':
        const faceVertices = parts.slice(1).map(p => {
          const indices = p.split('/').map(i => parseInt(i) - 1);
          return {
            vertex: indices[0],
            uv: indices[1],
            normal: indices[2]
          };
        });
        faces.push({
          vertices: faceVertices,
          group: currentGroup,
          material: currentMaterial
        });
        break;
    }
  }
  
  return { vertices, normals, uvs, faces };
}

// Parse MTL file
function parseMTL(content) {
  const materials = {};
  let currentMaterial = '';
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    
    switch (parts[0]) {
      case 'newmtl':
        currentMaterial = parts[1];
        materials[currentMaterial] = {};
        break;
      case 'Kd':
        materials[currentMaterial].color = [
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        ];
        break;
      case 'Ks':
        materials[currentMaterial].specular = [
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        ];
        break;
      case 'Ns':
        materials[currentMaterial].shininess = parseFloat(parts[1]);
        break;
      case 'd':
        materials[currentMaterial].opacity = parseFloat(parts[1]);
        break;
    }
  }
  
  return materials;
}

console.log('Parsing OBJ file...');
const obj = parseOBJ(objContent);
console.log(`Found ${obj.vertices.length} vertices, ${obj.faces.length} faces`);

console.log('Parsing MTL file...');
const materials = parseMTL(mtlContent);
console.log(`Found ${Object.keys(materials).length} materials`);

// Create GLB structure
function createGLB(obj, materials) {
  // Group faces by material
  const groups = {};
  
  for (const face of obj.faces) {
    const key = face.material || 'default';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(face);
  }
  
  // Create nodes for each group
  const nodes = [];
  let vertexOffset = 0;
  
  for (const [materialName, faces] of Object.entries(groups)) {
    const groupVertices = [];
    const groupIndices = [];
    const groupUVs = [];
    const groupNormals = [];
    
    let index = 0;
    for (const face of faces) {
      for (const fv of face.vertices) {
        groupVertices.push(...obj.vertices[fv.vertex]);
        if (fv.normal !== undefined && obj.normals[fv.normal]) {
          groupNormals.push(...obj.normals[fv.normal]);
        }
        if (fv.uv !== undefined && obj.uvs[fv.uv]) {
          groupUVs.push(...obj.uvs[fv.uv]);
        }
      }
      
      // Create triangle indices (assuming triangles)
      if (face.vertices.length === 3) {
        groupIndices.push(index, index + 1, index + 2);
        index += 3;
      } else if (face.vertices.length === 4) {
        // Convert quad to two triangles
        groupIndices.push(index, index + 1, index + 2);
        groupIndices.push(index, index + 2, index + 3);
        index += 4;
      }
    }
    
    nodes.push({
      name: materialName,
      vertices: new Float32Array(groupVertices),
      indices: new Uint32Array(groupIndices),
      uvs: new Float32Array(groupUVs),
      normals: new Float32Array(groupNormals),
      material: materials[materialName] || { color: [0.5, 0.5, 0.5] }
    });
  }
  
  return nodes;
}

const nodes = createGLB(obj, materials);
console.log(`Created ${nodes.length} mesh nodes`);

// For now, let's just create a simple GLB with the geometry data
// In a real scenario, you'd use a proper GLB encoder

// Create a simple binary GLTF (GLB) file
function createMinimalGLB(nodes) {
  // This is a simplified GLB creator
  // For production, use a proper GLB encoder like gltf-pipeline
  
  const gltf = {
    asset: {
      version: '2.0',
      generator: 'Precious One Photography Camera Converter'
    },
    scene: 0,
    scenes: [
      {
        name: 'Camera',
        nodes: nodes.map((_, i) => i)
      }
    ],
    nodes: nodes.map((node, i) => ({
      name: node.name,
      mesh: i
    })),
    meshes: nodes.map((node) => ({
      primitives: [
        {
          attributes: {
            POSITION: i * 3,
            NORMAL: i * 3 + 1,
            TEXCOORD_0: i * 3 + 2
          },
          indices: i * 3 + 3
        }
      ]
    })),
    accessors: [],
    bufferViews: [],
    buffers: []
  };
  
  return gltf;
}

// For now, let's just copy the OBJ files and create a manifest
// The actual conversion will be done client-side using Three.js OBJLoader

console.log('Creating camera model manifest...');

const manifest = {
  name: 'Camera Model',
  format: 'obj',
  files: {
    obj: '/images/camera/camera.obj',
    mtl: '/images/camera/camera.mtl',
    textures: {
      body: {
        baseColor: '/images/camera/cameraBody_Mat_baseColor.png',
        metallic: '/images/camera/cameraBody_Mat_metallic.png',
        normal: '/images/camera/cameraBody_Mat_normal.png',
        roughness: '/images/camera/cameraBody_Mat_roughness.png'
      },
      lens: {
        baseColor: '/images/camera/cameraLens_Mat_baseColor.png',
        metallic: '/images/camera/cameraLens_Mat_metallic.png',
        roughness: '/images/camera/cameraLens_Mat_roughness.png',
        translucence: '/images/camera/cameraLens_Mat_translucence.png'
      }
    }
  },
  groups: ['cameraBody', 'cameraLens'],
  materials: ['cameraBody_Mat', 'cameraLens_Mat']
};

fs.writeFileSync(
  path.join(modelsDir, 'camera-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('Camera model manifest created at public/models/camera-manifest.json');
console.log('Note: The OBJ model will be loaded client-side using Three.js OBJLoader');
