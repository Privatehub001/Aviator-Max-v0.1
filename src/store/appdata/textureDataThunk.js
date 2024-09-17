import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import * as PIXI from 'pixi.js';
export const getruntexture = 
   () => {
    let array = [];
    let run = [];

    for (let i = 0; i <=10; i++) {
      let img;
        img = require(`../../assets/run/run_speedy/run S_0000${i}.png`);
      run.push(img);
    }
    for (let i = 0; i < 11; i++) {
        let texture = PIXI.Texture.from(run[i]);
        array.push(texture);
      }
      return (array);
    }
export const getjumptexture = 
   () => {
    let array0 = [];
    let jump = [];
    for (let i = 1; i <= 21; i++) {
        let img;
          img = require(`../../assets/run/jump/jump${i}.png`);
        jump.push(img);
      }
  
  for (let i = 0; i < 21; i++) {
    let texture = PIXI.Texture.from(jump[i]);
    array0.push(texture);
  }
  return (array0);
   }
export const getlandtexture =
   () => {
    let array1 = [];
    let land = [];
    for (let i = 1; i <= 20; i++) {
        let img;
          img = require(`../../assets/run/land/land${i}.png`);
        land.push(img);
      }
      for (let i = 0; i < 20; i++) {
        let texture = PIXI.Texture.from(land[i]);
        array1.push(texture);
      }
      return (array1);
  }
