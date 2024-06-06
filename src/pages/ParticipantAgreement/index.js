import React, { useEffect, useState } from "react";
import ParticipantAgreement from "sections/Homepage/ParticipantAgreementSection";
import { PA_MANAGEMENT } from "constants/apiEndPoints";
import { GET_REQUEST, PATCH_REQUEST, POST_REQUEST } from "utils/HTTPRequests";
import { fileUploadEndPoints } from "constants/apiEndPoints";
import { dataURLtoFile } from "utils/commonFunctions";
import NotificationsToast from "utils/notification/NotificationsToast";

const ParticipantAgreementComponent = () => {
  const userDetails = localStorage.getItem('userDetails') && JSON.parse(localStorage.getItem('userDetails')) || {};
  useEffect(() => {
    createPA();
    // getParticipantAgreementData();
  }, []);

  let company_id = userDetails.company_id;
  const [PAData, setPAData] = useState({
    company_id: company_id,
    unsigned_doc:
      "https://eppdevstorage.blob.core.windows.net/agreement-docs/Energy-Performance-Program-Participant-Agreement.pdf",
    upload_sign: null,
    is_signed: false,
    signed_doc: null,
    status: null,
    signed_on: "",
    is_active: 1,
    created_by: null,
    updated_by: null,
  });

  let unsignedPAUrl =
    "https://eppdevstorage.blob.core.windows.net/agreement-docs/Energy-Performance-Program-Participant-Agreement.pdf";

  const createPA = () => {
    const apiURL = PA_MANAGEMENT.CREATE_PA;
    const body = {
      company_id: company_id,
      unsigned_doc: unsignedPAUrl,
    };
    POST_REQUEST(apiURL, body).then((response) => {
      getParticipantAgreementData();
    });
  };

  const getParticipantAgreementData = () => {
    const apiURL = PA_MANAGEMENT.CREATE_PA;
    GET_REQUEST(apiURL + `/${company_id}`)
      .then((res) => {
        setPAData((prevState) => {
          return {
            ...prevState,
            ...res?.data?.data
          }
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }; 

  const onDownloadUnsignedPA = () => {
    fetch(unsignedPAUrl).then((response) => {
      response.blob().then((blob) => {
        const fileURL = window.URL.createObjectURL(blob);
        let alink = document.createElement("a");
        alink.href = fileURL;
        let fileName = unsignedPAUrl.split("/");

        fileName = fileName[fileName.length - 1];
        alink.download = fileName;
        alink.click();
      });
    });
  };

  const onDownloadSignedPA = () => {
    if(!PAData.signed_doc){
      NotificationsToast({ message: "There is no signed participant agreement exist for you!", type: "error" });

    } else {
      fetch(PAData.signed_doc).then((response) => {
        response.blob().then((blob) => {
          const fileURL = window.URL.createObjectURL(blob);
          let alink = document.createElement("a");
          alink.href = fileURL;
          let fileName = userDetails?.first_name + "_" + userDetails?.last_name + "_signed_participant_agreement.pdf"
          alink.download = fileName;
          alink.click();
        });
      });
    }
    
  }

  const onUploadSignature = (signData) => {
    const file = dataURLtoFile(signData);
    const formData = new FormData();
    formData.append("file", file);
    const endpoint = fileUploadEndPoints.FILE_UPLOAD;
    POST_REQUEST(endpoint, formData, true, "").then((response) => {
      if (response?.data?.sasTokenUrl) {
        let body = {
          upload_sign: response?.data?.sasTokenUrl,
          username: `${userDetails?.first_name} ${userDetails?.last_name}`,
          rolename: userDetails?.rolename
        };
        PATCH_REQUEST(PA_MANAGEMENT.SIGN_PA + `/${company_id}`, body).then(
          (response) => {
            NotificationsToast({ message: "You have successfully signed the participant agreement!", type: "success" });
            getParticipantAgreementData();
          }
        );
      }
    });
  };

  const uploadSignedPA = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const endpoint = fileUploadEndPoints.FILE_UPLOAD;
    POST_REQUEST(endpoint, formData, true, "").then((response) => {
      if (response?.data?.sasTokenUrl) {
        let body = {
          signed_doc: response?.data?.sasTokenUrl,
        };
        PATCH_REQUEST(PA_MANAGEMENT.SIGN_PA + `/${company_id}`, body).then(
          (response) => {
            NotificationsToast({ message: "You have successfully signed the participant agreement!", type: "success" });
            getParticipantAgreementData();
          }
        );
      }
    });
  }

  return (
    <>
      <ParticipantAgreement
        onDownloadUnsignedPA={onDownloadUnsignedPA}
        onUploadSignature={onUploadSignature}
        isSigned={PAData.is_signed}
        onDownloadSignedPA={onDownloadSignedPA}
        uploadSignedPA={uploadSignedPA}
        pdfUrl={PAData.is_signed ? PAData.signed_doc : PAData.unsigned_doc}
        signedOn={PAData?.signed_on}
        signedBy={PAData?.signed_by}
      />
    </>
  );
};

export default ParticipantAgreementComponent;
