"use client";

import { useAppDispatch, useAppSelector } from "@/hook/hook";
import { closeModal } from "@/redux/slices/modal/modalSlice";
import { setSelectedQueue } from "@/redux/slices/queue/queueSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface ModalProps {
  onClickToggleModal: () => void;
}

interface QueueCreateInputBody {
  inQueueNm: string;
}

const Modal: React.FC<ModalProps> = ({ onClickToggleModal }) => {
  const schema = yup.object().shape({
    inQueueNm: yup
      .string()
      .required("Queue Name must be at least 1 character.")
      .max(200, "Queue Name cannot be longer than 200 characters."),
  });
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<QueueCreateInputBody>({
    resolver: yupResolver(schema),
  });

  const handleRegistration: SubmitHandler<QueueCreateInputBody> = (data) => {
    console.log(data);
    handleCreate(data);
  };
  const headleError = (errors: any) => {};

  const dispatch: any = useAppDispatch();
  const router = useRouter();
  const selectedId = useAppSelector((state) => state.isVpn.selectedId);
  const vpnId = selectedId?.mlsnSn;

  const handleCreate = async (data: QueueCreateInputBody) => {
    const baseUrl = `/api/v2/msgVpns/${vpnId}/queues`;
    try {
      const bodyData = {
        queueName: data.inQueueNm,
      };

      const response = await axios.post(baseUrl, bodyData, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      });

      const resCode = response.data.meta.responseCode;

      console.log(resCode);
      if (resCode === 200) {
        dispatch(setSelectedQueue({ queueName: data.inQueueNm }));
        dispatch(closeModal());
        alert("Queue Created Successfully");
        router.push("/channel/settings/edit");
      } else {
        alert("Failed to create queue.");
      }
    } catch (error: any) {
      const metaInfo = error.response.data.meta;

      if (metaInfo && metaInfo != null) {
        const errCd = metaInfo.responseCode;
        const errId = metaInfo.error.code;
        const errMsg = metaInfo.error.description;

        if (errCd && errCd === 400) {
          if (errId && errId === 11) {
            const splitVal = errMsg.split(": ");
            alert(splitVal[1]);
          } else {
            console.log(error);
          }
        } else {
          console.log(error);
        }
      }
    }
  };

  return (
    <>
      <div className="modal_wrap">
        <div className="modal_wrapbox">
          <div className="modal-dialog">
            <div className="modal-content w-400px">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Create Queue
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClickToggleModal}
                />
              </div>

              <div className="modal-body">
                <form>
                  <div className="row">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.inQueueNm ? "is-invalid" : ""
                      }`}
                      placeholder="queue name"
                      id="inQueueNm"
                      {...register("inQueueNm")}
                    />
                    <div className="invalid-feedback">
                      {errors.inQueueNm?.message}
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer justify-content-center">
                {/* <!-- button --> */}
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-md"
                    onClick={onClickToggleModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-outline-info btn-md"
                    onClick={handleSubmit(handleRegistration, headleError)}
                  >
                    Create
                  </button>
                </div>
                {/* <!-- END - button --> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
