import { defs, tiny } from "../examples/common.js";

const {
  Vector,
  Vector3,
  vec,
  vec3,
  vec4,
  color,
  hex_color,
  Shader,
  Matrix,
  Mat4,
  Light,
  Shape,
  Material,
  Scene,
} = tiny;

export default class FerrisWheel {
  shader = new defs.Phong_Shader();

  shapes = {
    wheel: new defs.Cylindrical_Tube(50, 50),
    spoke: new defs.Capped_Cylinder(50, 50),
    base: new defs.Cube(),
    cart: new defs.Subdivision_Sphere(4),
  };

  materials = {
    light: new Material(new defs.Phong_Shader(), {
      ambient: 1,
      diffusivity: 1,
      specularity: 1,
      color: hex_color("#D3D3D3"),
    }),
    dark: new Material(new defs.Phong_Shader(), {
      ambient: 1,
      diffusivity: 1,
      specularity: 1,
      color: hex_color("#949494"),
    }),
  };

  constructor() {}

  draw(context, program_state) {
    const t = program_state.animation_time / 1000;
    //============================================ ferris wheel =========================================
    // let ferris_transform = Mat4.scale(15, 15, 15);
    // ferris_transform = ferris_transform.times(Mat4.translation(0, 15, 0));
    let f_wheel_scale = 15;
    let f_distance_off_ground = 5;
    let ferris_height = f_wheel_scale + f_distance_off_ground + 0.1;
    let ferris_distance_back = -35;
    let f_wheel_transform = Mat4.translation(
      0,
      ferris_height,
      ferris_distance_back
    ); // translate ferris wheel up and to back
    f_wheel_transform = f_wheel_transform.times(
      Mat4.scale(f_wheel_scale, f_wheel_scale, f_wheel_scale * (2 / 3))
    ); // scale it to be larger
    this.shapes.wheel.draw(
      context,
      program_state,
      f_wheel_transform,
      this.materials.light
    ); // draw wheel
    // draw the base of ferris wheel as rectangle and cylinders in triangle format:
    let f_base_transform = Mat4.identity(); // drawing base: need translate*scale*transform
    f_base_transform = Mat4.scale(
      (f_wheel_scale * 4) / 3,
      f_distance_off_ground / 5,
      f_wheel_scale * (3 / 5)
    ).times(f_base_transform);
    f_base_transform = Mat4.translation(
      0,
      f_distance_off_ground / 5 + 0.1,
      ferris_distance_back
    ).times(f_base_transform); // translate over to correct position
    this.shapes.base.draw(
      context,
      program_state,
      f_base_transform,
      this.materials.dark
    ); // Q??? better to do (model_transform).times() or ().times(model_transform)
    // drawing spokes that hold up ferris wheel
    let f_spoke_scale = f_wheel_scale / 3;
    let f_base_spoke_transform = Mat4.identity(); // need translate (4) * rotate_to_right_angle (3) * scale (2) * rotate_to_right_orientation (1) -> T*R3*S*R1
    f_base_spoke_transform = Mat4.rotation(Math.PI / 2, 1, 0, 0).times(
      f_base_spoke_transform
    ); // R1
    f_base_spoke_transform = Mat4.scale(
      f_wheel_scale / 20,
      f_spoke_scale * 6,
      f_wheel_scale / 20
    ).times(f_base_spoke_transform); // S * R1
    f_base_spoke_transform = Mat4.rotation(Math.PI / 6, 0, 0, 1).times(
      f_base_spoke_transform
    ); // R3 * S * R1
    f_base_spoke_transform = Mat4.translation(
      f_wheel_scale * 0.5,
      ferris_height * (3 / 8),
      ferris_distance_back + f_wheel_scale * (3 / 8)
    ).times(f_base_spoke_transform); // T * R3 * S * R1
    this.shapes.spoke.draw(
      context,
      program_state,
      f_base_spoke_transform,
      this.materials.dark
    );

    f_base_spoke_transform = Mat4.identity(); // need translate*rotate_to_right_angle*scale*rotate_to_right_orientation -> T*R*S*R
    f_base_spoke_transform = Mat4.rotation(Math.PI / 2, 1, 0, 0).times(
      f_base_spoke_transform
    );
    f_base_spoke_transform = Mat4.scale(
      f_wheel_scale / 20,
      f_spoke_scale * 6,
      f_wheel_scale / 20
    ).times(f_base_spoke_transform);
    f_base_spoke_transform = Mat4.rotation(-Math.PI / 6, 0, 0, 1).times(
      f_base_spoke_transform
    );
    f_base_spoke_transform = Mat4.translation(
      -f_wheel_scale * 0.5,
      ferris_height * (3 / 8),
      ferris_distance_back + f_wheel_scale * (3 / 8)
    ).times(f_base_spoke_transform);
    this.shapes.spoke.draw(
      context,
      program_state,
      f_base_spoke_transform,
      this.materials.dark
    );

    let num_spokes = 10;
    for (let i = 0; i < num_spokes; i++) {
      // draw the spokes of wheel
      let f_spoke_transform = Mat4.identity(); // translate * rotateToMakeMove * rotateToRightAngle * scale * rotateToOrientation = T * R3 * S * R1
      f_spoke_transform = f_spoke_transform.times(
        Mat4.translation(
          0,
          ferris_height,
          ferris_distance_back + f_wheel_scale * (5 / 18)
        )
      ); // translate ferris spokes up and to front // T
      f_spoke_transform = f_spoke_transform.times(
        Mat4.rotation((t * Math.PI) / 10, 0, 0, 1)
      );
      f_spoke_transform = f_spoke_transform.times(
        Mat4.rotation((i / num_spokes) * (2 * Math.PI), 0, 0, 1)
      ); // T * R3
      f_spoke_transform = f_spoke_transform.times(
        Mat4.scale(f_wheel_scale / 60, f_spoke_scale * 6, f_wheel_scale / 60)
      ); // scale it to be larger // T * R3 * S
      f_spoke_transform = f_spoke_transform.times(
        Mat4.rotation(Math.PI / 2, 1, 0, 0)
      ); // rotate the spoke so that it is oriented properly to scale it // T * R3 * S * R1
      //f_spoke_transform = f_spoke_transform.times(Mat4.rotation(t * (Math.PI) / 2, 0, 0, 1));
      this.shapes.spoke.draw(
        context,
        program_state,
        f_spoke_transform,
        this.materials.light
      ); // .override({color: hex_color("#5A5A5A")})

      f_spoke_transform = Mat4.translation(
        0,
        ferris_height,
        ferris_distance_back - f_wheel_scale * (5 / 18)
      ); // translate ferris wheel up and to back
      f_spoke_transform = f_spoke_transform.times(
        Mat4.rotation((t * Math.PI) / 10, 0, 0, 1)
      );
      f_spoke_transform = f_spoke_transform.times(
        Mat4.rotation((i / num_spokes) * (2 * Math.PI), 0, 0, 1)
      );
      f_spoke_transform = f_spoke_transform.times(
        Mat4.scale(f_wheel_scale / 60, f_spoke_scale * 6, f_wheel_scale / 60)
      ); // scale it to be larger
      f_spoke_transform = f_spoke_transform.times(
        Mat4.rotation(Math.PI / 2, 1, 0, 0)
      ); // rotate the spoke so that it is oriented properly to scale it
      this.shapes.spoke.draw(
        context,
        program_state,
        f_spoke_transform,
        this.materials.light
      ); // .override({color: hex_color("#5A5A5A")})

      let f_cart_transform = Mat4.identity(); // want it to scale, translate to outside circle (1), then rotate to right place, then rotate to move, then translate to right place (3): T3*Rm*R*T1*S
      f_cart_transform = f_cart_transform.times(
        Mat4.translation(0, ferris_height, ferris_distance_back)
      ); // T3
      f_cart_transform = f_cart_transform.times(
        Mat4.rotation((t * Math.PI) / 10, 0, 0, 1)
      ); // T3 * Rm
      f_cart_transform = f_cart_transform.times(
        Mat4.rotation((i / num_spokes) * (2 * Math.PI), 0, 0, 1)
      ); // T3 * R
      f_cart_transform = f_cart_transform.times(
        Mat4.translation(0, (f_wheel_scale * 8) / 7, 0)
      ); // T3 * R * T1
      f_cart_transform = f_cart_transform.times(
        Mat4.scale(
          (3 / 15) * f_wheel_scale,
          (2 / 15) * f_wheel_scale,
          (4 / 15) * f_wheel_scale
        )
      );
      //  f_cart_transform = Mat4.translation(0, ferris_height, ferris_distance_back - f_wheel_scale*(5/18)).times(f_cart_transform);  // translate ferris wheel up and to back
      // f_cart_transform = f_cart_transform.times(Mat4.rotation(t * (Math.PI) / 10, 0, 0, 1));
      //     f_cart_transform = f_cart_transform.times(Mat4.rotation((i / num_spokes)*(2*Math.PI), 0, 0, 1));
      //            f_cart_transform = f_cart_transform.times(Mat4.scale(f_wheel_scale/60, f_spoke_scale*6, f_wheel_scale/60));  // scale it to be larger

      this.shapes.cart.draw(
        context,
        program_state,
        f_cart_transform,
        this.materials.light.override({
          color: hex_color("#FF0000"),
        })
      );
    }
  }
}
