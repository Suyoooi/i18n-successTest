"use client";

import { useAppDispatch } from "@/hook/hook";
import { setUserId } from "@/redux/slices/login/authSlice";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setUserId({ id: id }));
    router.push("/monitor");

    // postLogin();
  };

  // dGVzdDEyMzQ1ISE=
  const postLogin = async () => {
    const encodedPassword = window.btoa(password);
    console.log("::password::", encodedPassword);

    const url = "/api/v2/auth/login";
    try {
      const bodyData = {
        userId: id,
        userPwd: encodedPassword,
      };
      console.log(bodyData);
      const response = await axios.post(url, bodyData, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
      if (response.status === 200) {
        console.log("넘어가라ㅏㅏ");
        const accessToken = response.data.accessToken;
        console.log("Access Token:", accessToken);

        dispatch(setUserId({ id: id }));
        document.cookie = `accessToken=${accessToken}; path=/; Secure; HttpOnly; SameSite=Strict`;
        router.push("/monitor");
      } else {
        alert("Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("failed login");
    }
  };
  return (
    <>
      <section id="content" className="content">
        <div className="content__boxed w-100 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <div className="content__wrap">
            <div className="sol_logout-canvas">
              <div className="sol_login_backcolor">
                <div className="sol_login_background">
                  <div className="sol_login_bg_box_outline">
                    <div className="sol_login_bg_box">
                      <form onSubmit={handleLogin} className="sol_form_login">
                        <div className="text-center">
                          <h1>
                            <Image src={"./assets/img/solace_img/bi_acellemma.svg"} width={263} height={34} alt="ACell EMMA"></Image>
                          </h1>
                        </div>
                        <div className="row sol_form_login_input no-gutters">
                          <input
                            className="form-control"
                            type="text"
                            value={id}
                            onChange={handleIdChange}
                            // onChange={(e) => setLoginIdState(e.target.value)}
                            placeholder="ID"
                            required
                          />
                          <input
                            type="password"
                            className="form-control"
                            onChange={handlePasswordChange}
                            placeholder="Password"
                            value={password}
                            required
                          />
                          <button
                            type="submit"
                            className="btn btn_lg_login sol_mt_20"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                      <div className="row sol_form_login_footer">
                        <p>ACell EMMA community</p>
                        <p>
                          This product is proprietary software of Epozen
                          Copropration. <br />
                          By accessing this product you are agreeing to the
                          license terms and conditionslocated at
                          <br />
                          <a href="" className="sol_form_a">
                            www.epozen.co.kr/license-softward
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
