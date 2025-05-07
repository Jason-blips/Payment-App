import React from "react";
import Common from "./Common"; // 确保正确导入 Common 组件

const creative = [
    {
        heading: "Computer Science",
        title: "University of York",
        desc: "Studied advanced computing, algorithms, and software engineering.",
    },
    {
        heading: "Machine Learning",
        title: "Online Courses",
        desc: "Completed courses on AI, deep learning, and data science.",
    },
];

const Educations = () => {
    return (
        <section className="educations creative">
            <div className="container">
                <div className="itemContent">
                    <Common title="educations" />
                    <div className="content flex">
                        {creative.map((val, index) => (
                            <div className="education-item" key={index}>
                                <div className="contentRight">
                                    <img src="./images/education-bg.jpg" alt="Education" />
                                </div>
                                <div className="contentLeft">
                                    <i className="fa fa-quote-left quote"></i>
                                    <h1>{val.heading}</h1>
                                    <h3>{val.title}</h3>
                                    <p>{val.desc}</p>
                                    <button className="primary-btn">
                                        DOWNLOAD RESUME <i className="fa fa-long-arrow-alt-right"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Educations;
