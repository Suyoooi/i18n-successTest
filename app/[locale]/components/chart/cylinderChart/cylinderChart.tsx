"use client";
import React, { useRef, useEffect } from "react";

interface CylinderProps {
  radius: number;
  heightVal: number;
  percentage: number;
  fillColor: string;
  color: string;
}

const CylinderChart: React.FC<CylinderProps> = ({
  radius,
  heightVal,
  percentage,
  fillColor,
  color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCylinder = (ctx: CanvasRenderingContext2D) => {
    const x = radius; // 원통의 중심 x 좌표, 캔버스의 너비를 기준으로 계산
    const y = radius / 2 + 10; // 원통의 상단 y 좌표, 상단에 여백 10px을 줌
    const cylinderTotalHeight = heightVal - 20; // 하단에 20만큼의 여백이 있어서 상단에도 20 여백을 주기 위해 -20을 함
    const height = cylinderTotalHeight - radius; // 원통 높이
    const waterHeight = (height * percentage) / 100; // 물이 차 있는 높이 비율로 계산

    // 상단 원
    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius / 2, 0, 0, 2 * Math.PI);
    // ctx.fillStyle = "rgba(184, 223, 255)";
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();

    // 원통의 측면 (물이 차있지 않은 공간)
    ctx.beginPath();
    // 측면 사각형
    ctx.rect(x - radius, y, 2 * radius, height);
    // ctx.fillStyle = "rgba(70, 130, 180, 0.7)";
    ctx.fillStyle = color;
    ctx.fill();
    // ctx.stroke();

    // 오른쪽과 왼쪽 변에만 테두리 적용
    // 90도 회전하기 전으로 생각해야함
    ctx.beginPath();
    ctx.moveTo(x - radius, y); // 왼쪽 상단 시작점
    ctx.lineTo(x - radius, y + height); // 왼쪽 하단
    ctx.moveTo(x + radius, y); // 오른쪽 상단 시작점
    ctx.lineTo(x + radius, y + height); // 오른쪽 하단
    ctx.stroke();

    // 물이 차 있는 부분의 하단 반원
    ctx.beginPath();
    ctx.ellipse(
      x,
      y + height - waterHeight,
      radius,
      radius / 2,
      0,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.stroke();
    // ctx.beginPath();
    // ctx.ellipse(x, y + height - waterHeight, radius, radius / 2, 0, 0, Math.PI);
    // ctx.fillStyle = "rgba(65, 105, 225)";
    // ctx.fill();

    // 물이 차 있는 부분의 상단 직사각형
    ctx.beginPath();
    ctx.rect(x - radius, y + height - waterHeight, 2 * radius, waterHeight);
    ctx.fillStyle = fillColor;
    ctx.fill();
    // ctx.stroke();
    // 마찬가지로 오른쪽 왼쪽만 border 적용
    ctx.beginPath();
    ctx.moveTo(x - radius, y); // 왼쪽 상단 시작점
    ctx.lineTo(x - radius, y + height); // 왼쪽 하단
    ctx.moveTo(x + radius, y); // 오른쪽 상단 시작점
    ctx.lineTo(x + radius, y + height); // 오른쪽 하단
    ctx.stroke();

    // // 물이 차 있는 부분에 텍스트 추가
    // // ctx.save();
    // ctx.font = "40px";
    // ctx.fillStyle = "#000";
    // // ctx.rotate(-Math.PI / 2);
    // // ctx.textAlign = "center";
    // // ctx.rotate(Math.PI / 2);

    // // 텍스트 위치
    ctx.font = "15px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(x, y + height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(`${percentage}%`, 0, 0);
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-x, -(y + height / 2));
    // const textX = x - radius / 2;
    // const textY = y + height - waterHeight + 20;
    // ctx.fillText(`${percentage}%`, textX, textY);
    // // ctx.restore();

    // 하단 원
    ctx.beginPath();
    ctx.ellipse(x, y + height, radius, radius / 2, 0, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context) {
      // 캔버스 삭제
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      // 원통 그리기
      drawCylinder(context);
    }
  }, [radius, percentage, heightVal]);

  return (
    <div
      style={{
        width: heightVal,
        height: radius * 2,
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={radius * 2}
        height={heightVal}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
      {/* <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 15,
          fontWeight: 700,
        }}
      >
        {percentage}%
      </div> */}
    </div>
  );
};
export default CylinderChart;
