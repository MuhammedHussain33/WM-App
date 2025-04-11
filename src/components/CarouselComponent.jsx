// src/components/CarouselComponent.jsx
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CarouselComponent = () => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-8 transition-transform transform hover:scale-105">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        interval={3000}
        transitionTime={800}
        swipeable
        emulateTouch
      >
        <div>
          <img
            src="https://www.econlib.org/wp-content/uploads/2018/05/recycling-2.jpg"
            alt="Recycle"
            className="object-cover h-64 w-full"
          />
          <p className="legend bg-green-700 text-white">♻️ Recycle Responsibly</p>
        </div>
        <div>
          <img
            src="https://t4.ftcdn.net/jpg/02/89/65/23/360_F_289652334_nBplOu8YUDpQNz6FCsjsFJEHMrRavbvZ.jpg"
            alt="Green Eco"
            className="object-cover h-64 w-full"
          />
          <p className="legend bg-green-700 text-white">🌱 Nurture Nature</p>
        </div>
        <div>
          <img
            src="https://media.istockphoto.com/id/1217947237/vector/garbage-truck-isolated-on-white-background-clip-art-of-recycle-truck-waste-management.jpg?s=612x612&w=0&k=20&c=Epf9wnfyB-Fgl5uvACXWMIwBgEmyZ_3Jgt9rAhC5nSo="
            alt="Waste Collection"
            className="object-cover h-64 w-full"
          />
          <p className="legend bg-green-700 text-white">🚛 Smart Waste Collection</p>
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
