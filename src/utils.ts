export function setAttribute(gl: WebGLRenderingContext, type: number, location: number, v: Float32Array | Array<number>): void {
  const mapper = {
    [gl.FLOAT](): void {
      gl.vertexAttrib1fv(location, v);
    },
    [gl.FLOAT_VEC2](): void {
      gl.vertexAttrib2fv(location, v);
    },
    [gl.FLOAT_VEC3](): void {
      gl.vertexAttrib3fv(location, v);
    },
    [gl.FLOAT_VEC4](): void {
      gl.vertexAttrib4fv(location, v);
    },
    [gl.FLOAT_MAT2](): void {
      gl.vertexAttrib2f(location, v[0], v[1]);
      gl.vertexAttrib2f(location + 1, v[2], v[3]);
    },
    [gl.FLOAT_MAT3](): void {
      gl.vertexAttrib3f(location, v[0], v[1], v[2]);
      gl.vertexAttrib3f(location + 1, v[3], v[4], v[5]);
      gl.vertexAttrib3f(location + 2, v[6], v[7], v[8]);
    },
    [gl.FLOAT_MAT4](): void {
      gl.vertexAttrib4f(location, v[0], v[1], v[2], v[3]);
      gl.vertexAttrib4f(location + 1, v[4], v[5], v[6], v[7]);
      gl.vertexAttrib4f(location + 2, v[8], v[9], v[10], v[11]);
      gl.vertexAttrib4f(location + 3, v[12], v[13], v[14], v[15]);
    },
  };
  mapper[type]();
}

export function bindAttribute(gl: WebGLRenderingContext, type: number, size: number, location: number, stride: number, offset: number, fSize: number): void {
  const mapper = {
    [gl.FLOAT](): void {
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, fSize * stride, fSize * offset);
      gl.enableVertexAttribArray(location);
    },
    [gl.FLOAT_VEC2](): void {
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, fSize * stride, fSize * offset);
      gl.enableVertexAttribArray(location);
    },
    [gl.FLOAT_VEC3](): void {
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, fSize * stride, fSize * offset);
      gl.enableVertexAttribArray(location);
    },
    [gl.FLOAT_VEC4](): void {
      gl.vertexAttribPointer(location, size, gl.FLOAT, false, fSize * stride, fSize * offset);
      gl.enableVertexAttribArray(location);
    },
    [gl.FLOAT_MAT2](): void {
      gl.vertexAttribPointer(location, size / 2, gl.FLOAT, false, fSize * stride, fSize * offset);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location + 1, size / 2, gl.FLOAT, false, fSize * stride, fSize * offset + fSize * size / 2);
      gl.enableVertexAttribArray(location + 1);
    },
    [gl.FLOAT_MAT3](): void {
      gl.vertexAttribPointer(location, size / 3, gl.FLOAT, false, fSize * stride, fSize * offset);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location + 1, size / 3, gl.FLOAT, false, fSize * stride, fSize * offset + fSize * size / 3);
      gl.enableVertexAttribArray(location + 1);
      gl.vertexAttribPointer(location + 2, size / 3, gl.FLOAT_VEC3, false, fSize * stride, fSize * offset + fSize * 2 * size / 3);
      gl.enableVertexAttribArray(location + 2);
    },
    [gl.FLOAT_MAT4](): void {
      gl.vertexAttribPointer(location, size / 4, gl.FLOAT, false, fSize * stride, fSize * offset);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location + 1, size / 4, gl.FLOAT, false, fSize * stride, fSize * offset + fSize * size / 4);
      gl.enableVertexAttribArray(location + 1);
      gl.vertexAttribPointer(location + 2, size / 4, gl.FLOAT, false, fSize * stride, fSize * offset + fSize * 2 * size / 4);
      gl.enableVertexAttribArray(location + 2);
      gl.vertexAttribPointer(location + 3, size / 4, gl.FLOAT, false, fSize * stride, fSize * offset + fSize * 3 * size / 4);
      gl.enableVertexAttribArray(location + 3);
    },
  };
  mapper[type]();
}

export function setUniform(gl: WebGLRenderingContext, type: number, location: WebGLUniformLocation, v: Float32Array | Int32Array | Array<number>): void {
  const mapper = {
    [gl.FLOAT](): void {
      gl.uniform1fv(location, v);
    },
    [gl.FLOAT_VEC2](): void {
      gl.uniform2fv(location, v);
    },
    [gl.FLOAT_VEC3](): void {
      gl.uniform3fv(location, v);
    },
    [gl.FLOAT_VEC4](): void {
      gl.uniform4fv(location, v);
    },
    [gl.FLOAT_MAT2](): void {
      gl.uniformMatrix2fv(location, false, v);
    },
    [gl.FLOAT_MAT3](): void {
      gl.uniformMatrix3fv(location, false, v);
    },
    [gl.FLOAT_MAT4](): void {
      gl.uniformMatrix4fv(location, false, v);
    },

    [gl.UNSIGNED_BYTE](): void {
      gl.uniform1iv(location, v);
    },
    [gl.UNSIGNED_INT](): void {
      gl.uniform1iv(location, v);
    },
    [gl.UNSIGNED_SHORT](): void {
      gl.uniform1iv(location, v);
    },
    [gl.SHORT](): void {
      gl.uniform1iv(location, v);
    },
    [gl.INT](): void {
      gl.uniform1iv(location, v);
    },
    [gl.TEXTURE](): void {
      gl.uniform1iv(location, v);
    },
    [gl.INT_VEC2](): void {
      gl.uniform2iv(location, v);
    },
    [gl.INT_VEC3](): void {
      gl.uniform3iv(location, v);
    },
    [gl.INT_VEC4](): void {
      gl.uniform4iv(location, v);
    },
  };
  mapper[type]();
}