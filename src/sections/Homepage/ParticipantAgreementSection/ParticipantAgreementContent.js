import { Typography, Box, styled, Stack, Link } from "@mui/material";
import useMediaQueries from "utils/mediaQueries/mediaQueries";
import { useEffect, useRef, useState } from "react";

const StyledContentWrapper = styled(Box)(() => {
  const { getTheme } = useMediaQueries();

  return {
    position: "relative",
    padding: "1rem",
    background: "#F5FFF7",
    borderRadius: "1.25rem",
    border: "1px solid #2E813E",
    maxHeight: "65dvh",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: "5px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#348D3D60",
      borderRadius: "1.375rem",
      "&:hover": {
        backgroundColor: "#348D3D",
      },
    },
    "&:hover ::-webkit-scrollbar": {
      display: "block",
    },
  };
});

const ParticipantAgreementContent = ({ onScrollToBottom }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = contentRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        onScrollToBottom(true);
      } else {
        onScrollToBottom(false);
      }
    };

    contentRef.current.addEventListener("scroll", handleScroll);

    return () => {
      contentRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollToBottom]);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        pt: "2rem",
      }}
    >
      <StyledContentWrapper ref={contentRef}>
        <Typography variant="small2">
          The Participant (being the{" "}
          <Typography variant="span2" sx={{ fontWeight: 600 }}>
            “Applicant”
          </Typography>{" "}
          in the Application) has applied for Performance Incentives, in respect
          of electricity savings achieved at one or more Facilities through
          operational and maintenance energy efficiency measures and equipment
          retrofits, pursuant to the Application submitted to the IESO under the
          Save on Energy - Energy Performance Program (the{" "}
          <Typography variant="span2" sx={{ fontWeight: 600 }}>
            “EPP”
          </Typography>{" "}
          or the{" "}
          <Typography variant="span2" sx={{ fontWeight: 600 }}>
            “Program”
          </Typography>{" "}
          ) in accordance with the Program Requirements. All capitalized terms
          not defined herein will have the meanings given to them in Schedule A
          to this Agreement. In consideration of the Performance Incentives
          being provided and other good and valuable consideration the receipt
          and sufficiency of which are hereby acknowledged, the Participant
          agrees to the following terms and conditions:
        </Typography>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          1. BASELINE ENERGY MODEL AND PRE-PROJECT INCENTIVE
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Upon acceptance of the Baseline Energy Model generated via the EPP
              Portal and issuance of a Notice of Approval, the Facility will be
              deemed accepted into the Program, and the Participant shall be
              entitled to receive an optional, one-time advance of part of its
              anticipated Performance Incentive for such Facility, calculated as
              follows: Baseline Energy Consumption * 2.5% * $0.04/kWh (the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Pre-Project Incentive”
              </Typography>{" "}
              ). Payment of the Pre-Project Incentive hereunder is conditional
              upon the Participant providing an invoice detailing the Facility
              which has been approved by the IESO and such additional
              information as prescribed by IESO to substantiate the payment.
            </Typography>
          </Typography>

          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography
              variant="small2"
              sx={{ pl: 1, wordBreak: "break-word" }}
            >
              AdditionalFacilitiesmaybeincludedforparticipationintheProgramfromtimetotimeduring
              the Term by the Participant submitting the required Facility
              information via the EPP Portal and accepting the Baseline Energy
              Model generated for such Facility, provided that no new Facilities
              will be accepted after December 31, 2024.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant shall be required to report any Non-Routine Event
              (NRE) to the Service Provider via the EPP Portal as soon as they
              become aware of such event. The nature of the event (e.g.,
              temporary or permanent), the dates, and an explanation of the
              event should be provided. In addition, the Participant is required
              to submit a request for a Non-Routine Adjustment (NRA) within 60
              days of becoming aware of such NRE. In the event of disagreement
              as to whether an event constitutes a Non-Routine Event, the
              opinion of the IESO shall govern.
            </Typography>
          </Typography>
        </Stack>

        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          2. PARTICIPANT OBLIGATIONS, ELIGIBLE MEASURES AND SAVINGS SUBMISSION
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            In addition to the other obligations contained in this Agreement,
            the Participant will fulfill the following obligations in order to
            maintain its eligibility in the Program and as a condition of
            receiving any Performance Incentives:
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant will implement Eligible Measures for each Facility
              before the end of the second Pay-For-Performance Period.
            </Typography>
          </Typography>

          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              After the generation of the Baseline Energy Model for a Facility
              via the EPP Portal, the Participant will not enroll in any program
              or initiative incentivizing electricity savings and/or peak demand
              savings undertaken by the Government of Ontario or the IESO to
              receive any incentives for that Facility. The Participant will
              inform IESO if any projects receiving electricity saving
              incentives and/or peak demand savings are commissioned after the
              Baseline Energy Model has been accepted by the Participant, and
              this will trigger an NRA at the discretion of the IESO.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c){" "}
            <Typography variant="small2" sx={{ pl: 1 }}>
              Each Facility shall achieve a minimum of five percent (5%) of the
              Total Electricity Savings by the end of the second
              Pay-for-Performance Period (the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Minimum Savings”
              </Typography>{" "}
              ). Further, and notwithstanding any renewal or extension of the
              Program, a Facility may participate in a maximum of three (3)
              consecutive Pay-for-Performance Periods.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (d)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Any Facility that does not achieve the Minimum Savings, may be
              eliminated from further participation in the Program at the sole
              discretion of the IESO, upon written notice by the IESO or Service
              Provider, and the Participant shall not be entitled to any further
              Performance Incentive with respect to such Facility and the
              Participant shall reimburse the IESO for any Pre-Project Incentive
              the IESO provided but which the Participant did not subsequently
              earn in respect of the Facility. Any Facility that does not
              achieve the Minimum Savings and is not eliminated from further
              participation pursuant to this section shall reimburse the IESO
              for any Pre-Project Incentive provided but which the Participant
              did not subsequently earn upon completion of the third
              Pay-for-Performance Period for the Facility.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (e)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant must submit to the IESO the Facility energy data
              and associated information required by the Savings Submission via
              the EPP Portal within 30 days following the expiration of the
              Pay-for-Performance Period in respect of each such Facility. The
              Participant shall notify the Service Provider of any Measures that
              are not Eligible Measures and which it has implemented during the
              Pay-for-Performance Period.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (f)
            <Typography variant="small2" sx={{ pl: 1 }}>
              In the event this Agreement is terminated in accordance with
              Section 5(b)(ii), the Participant may notify the Service Provider
              of any completed portion of a Pay-for-Performance Period, ending
              on the earlier of (i) the date of termination of this Agreement or
              (ii) the otherwise occurring end of the relevant
              Pay-for-Performance Period. Any Performance Incentives owing for
              such partial Pay-for-Performance Period shall be paid based on the
              length of such partial Pay-for-Performance Period.
            </Typography>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          3. PERFORMANCE INCENTIVES
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Subject to the terms and conditions of this Agreement, the IESO
              will pay the Performance Incentive for each Facility less the
              amount of the Pre-Project Incentive(s) received by the Participant
              until exhausted. The Performance Incentive shall be calculated for
              each Payfor-Performance Period as follows:
            </Typography>
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 2,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (i)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  Off-Peak Energy Incentive Rate of $0.04/kWh multiplied by the
                  Off-Peak Electricity Savings; and
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (ii)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  On-Peak Energy Incentive Rate of $0.15/kWh multiplied by the
                  On-Peak Electricity Savings.
                </Typography>
              </Typography>
            </Stack>
          </Typography>

          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Performance Incentive for each Facility shall not exceed the
              Off-Peak Energy Incentive Rate multiplied by 20% of the Baseline
              Energy Consumption (the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Incentive Cap”
              </Typography>{" "}
              ).
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c){" "}
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant shall invoice the IESO for the Performance
              Incentive listed in the approved Savings Report, and the IESO will
              pay, at its sole discretion, the Performance Incentive listed in
              the approved Savings Report, less the amount of the Pre-Project
              Incentive(s) received by the Participant until exhausted, within a
              reasonable period following receipt of such invoices, which period
              may be more than 90 days and via electronic funds transfer or by
              cheque issued by the IESO or its subcontractor. The IESO will not
              pay, and the Participant will not be entitled to any payment
              referred to herein unless the Participant has provided all
              supporting documentation and evidence as required by this
              Agreement or as otherwise requested by the IESO.
            </Typography>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          4. . COMMUNICATION WITH SERVICE PROVIDER
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            The IESO reserves the right to engage a third party service provider
            (including the Service Provider), at any time, to exercise or
            perform any of the IESO’s rights or obligations under this
            Agreement, in full or in part, including with respect to the
            administration of the Program, the review of the Application or any
            other program deliverables, the payment of the Participant
            Incentives or any other activities described in this Agreement. The
            Participant shall cooperate and provide on a timely basis the
            requested information to the IESO or the Service Provider should the
            IESO or the Service Provider require clarification from the
            Participant related to any reports or information required under
            this Agreement. The Participant shall, at the same time as it
            provides information to the Service Provider, provide a copy of such
            information to the IESO.
          </Typography>
          <Typography variant="small2">
            Communications to the Service Provider shall be sent to{" "}
            <Link> info@energyperformanceprogram.ca.</Link>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          5. TERM, TERMINATION AND SURVIVAL
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              This Agreement will terminate upon the completion of the third
              Pay-for-Performance Period for the latest approved Facility that
              is incorporated into and forms part of this Agreement, provided
              that such Pay-for-Performance Period expires by December 31, 2027
              (the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Term”
              </Typography>{" "}
              ), unless terminated earlier in accordance with the terms of this
              Agreement.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              This Agreement will terminate on the expiry of the Term as
              provided in Section 5(a) or earlier:
            </Typography>
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 2,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (i)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  as a result of the Participant’s failure to observe or perform
                  any obligation required to be observed or performed under this
                  Agreement and such failure continues for a period of thirty
                  (30) calendar days after delivery of written notice by the
                  IESO to cure such failure; or
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (ii)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  upon 60 days’ notice by the IESO; or
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (iii)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  if the Participant becomes or is declared Insolvent, becomes
                  the subject of any proceeding related to its liquidation or
                  insolvency which is not dismissed within ninety (90) calendar
                  days, or makes an assignment for the benefit of creditors; or
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (iv)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  at the sole discretion of IESO, where the Participant did not
                  achieve the Minimum Savings for a Facility
                </Typography>
              </Typography>
            </Stack>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c)
            <Typography variant="small2" sx={{ pl: 1 }}>
              If the IESO terminates the Agreement or a Facility from the
              Program, pursuant to Section 5(b) or 2(d), respectively, the
              Participant shall reimburse the IESO for any Pre-Project Incentive
              the IESO provided but which the Participant did not subsequently
              earn under the Agreement or in respect of the Facility, as the
              case may be.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (d)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Sections 2(d), 5(c), 6, 8, 10, 11, 12, 13, 14, and 15(d) and (e),
              and such other provisions as are necessary for the interpretation
              thereof and any other provisions hereof, the nature and intent of
              which is to survive termination or expiration of this Agreement,
              will survive the expiration or termination of this Agreement.
              Without limiting the generality of the foregoing, if the
              Participant is entitled to receive a Performance Incentive(s)
              pursuant to the Agreement after the expiration of the Term, then
              the provisions of the Agreement applicable to such Performance
              Incentive will survive the termination of the Agreement.
            </Typography>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          6. ENVIRONMENTAL ATTRIBUTES
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              All right, title and interest in and to all benefits or
              entitlements associated with decreased environmental impacts now
              or in the future, direct or indirect, arising as a result of,
              relating to or in connection with the electricity savings for
              which an incentive has been paid, and the right to quantify and
              register these, including any energy efficiency certificate,
              renewable energy certificate, credit, reduction right, offset,
              allocated pollution right, emission, reduction allowance
              (collectively, the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Electricity Savings Environmental Attributes”
              </Typography>{" "}
              ) will be allocated on a proportionate basis, with the IESO owning
              an amount equal to the total quantity of Electricity Savings
              Environmental Attributes multiplied by the Environmental Attribute
              Funding Percentage (the result being the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “IESO Environmental Attributes”
              </Typography>{" "}
              ) and the Participant owning the remaining quantity of Electricity
              Savings Environmental Attributes (the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Participant Environmental Attributes”
              </Typography>{" "}
              ), where Environmental Attribute Funding Percentage means, in
              respect of an eligible Measure purchase and installed, the total
              incentive amount paid to the Participant and funded by the IESO in
              respect of the Measure, divided by the total amount of actual
              costs incurred by the Participant that meet the eligibility
              requirements for such costs set out under these terms and
              conditions, multiplied by 100, and expressed as a percentage.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant shall notify the IESO in writing prior to
              assigning, transferring, encumbering, submitting for compliance
              purposes, trading or otherwise using (collectively,{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “realizing”
              </Typography>{" "}
              ) any of the Participant Environmental Attributes, with such
              notice to include:
            </Typography>
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 2,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (i)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  the quantity of Participant Environmental Attributes to which
                  the Participant believes it is entitled;
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (ii)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  the quantity of Electricity Savings Environmental Attributes
                  and the Environmental Attributes Funding Percentage used to
                  determine the quantity of Participant Environmental
                  Attributes; and
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (iii)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  supporting calculations and data used to determine the total
                  quantity of Electricity Savings Environmental Attributes and
                  the Environmental Attribute Funding Percentage
                </Typography>
              </Typography>
            </Stack>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant agrees that all right, title and interest in and
              to all benefits or entitlements associated with the IESO
              Environmental Attributes are hereby transferred and assigned by
              the Participant to, or to the extent transfer or assignment is not
              permitted, held in trust for, the IESO and its successors and
              assigns.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (d)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The IESO will be entitled unilaterally and without consent to deal
              with such IESO Environmental Attributes in any manner it
              determines. The Participant acknowledges that the IESO will
              contact the Participant prior to realizing on any IESO
              Environmental Attributes.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (e)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant agrees that it will, from time to time, upon
              written direction of the IESO, take all such actions and do all
              such things necessary to:
            </Typography>
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 2,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (i)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  effect the transfer and assignment to, or holding in trust
                  for, the IESO all rights, title and interest in all IESO
                  Environmental Attributes; and
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (ii)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  certify, obtain, qualify and register with the relevant
                  authorities or agencies IESO Environmental Attributes that are
                  created and allocated or credited pursuant to applicable laws
                  and regulations from time to time for the purpose of
                  transferring such IESO Environmental Attributes to the IESO.
                  The Participant will be entitled to reimbursement by the IESO
                  of the cost of complying with such a direction provided that
                  the IESO, acting reasonably, has approved such cost of
                  compliance in writing prior to the cost being incurred and
                  provided that such reimbursement will be limited to: (x) the
                  total amount of such cost of compliance that have been
                  approved in advanced by the IESO, multiplied by (y) the
                  applicable Environmental Attributes Funding Percentage.
                </Typography>
              </Typography>
            </Stack>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          7. REPRESENTATIONS, WARRANTIES AND COVENANTS
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            The Participant represents and warrants to the IESO as follows, and
            acknowledges that the IESO is relying on such representations and
            warranties in entering into this Agreement:
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              All information provided in the Application, including any
              attached documentation, as well as any information submitted via
              the Savings Submission is true, accurate and complete and there is
              no material information omitted which makes the Application or
              program deliverables misleading or inaccurate;
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              the Participant would not otherwise have undertaken the Eligible
              Measures without the financial support and participation of the
              IESO;
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c)
            <Typography variant="small2" sx={{ pl: 1 }}>
              the Participant, the Facility and the Measures satisfy the
              eligibility criteria set out in Schedule “B” – Eligibility
              Criteria as of the date hereof;
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (d)
            <Typography variant="small2" sx={{ pl: 1 }}>
              the Participant has the authority to execute this Agreement and to
              fulfill its obligations as contemplated herein;
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (e)
            <Typography variant="small2" sx={{ pl: 1 }}>
              the Participant has all required rights and authority to install
              the Eligible Measures and to carry out all of its obligations as
              set out in this Participant Agreement;
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (f)
            <Typography variant="small2" sx={{ pl: 1 }}>
              there is no bankruptcy, insolvency, reorganization, receivership,
              seizure, realization, arrangement or other similar proceedings
              pending against, or being contemplated by the Participant or, to
              the knowledge of the Participant, threatened against the
              Participant;
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (g)
            <Typography variant="small2" sx={{ pl: 1 }}>
              there are no actions, suits, proceedings, judgements, rulings or
              orders by or before any Governmental Authority or arbitrator, or,
              to the knowledge of the Participant, threatened against the
              Participant, that could have a Material Adverse Effect on the
              Participant;
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (h)
            <Typography variant="small2" sx={{ pl: 1 }}>
              the Eligible Measures at each Facility will be carried out in
              accordance with all Applicable Laws including without limitation
              the Building Code Act, 1992, S.O. 1992, c. 23 and regulations made
              thereunder and all Applicable Laws related to construction;
            </Typography>
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 2,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (i)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  the Participant further acknowledges that it is an independent
                  contractor, and that there is no joint venture, partnership or
                  agency created or implied by this Agreement.
                </Typography>
              </Typography>
            </Stack>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          8. EVALUATION, MEASUREMENT AND VERIFICATION (EM&V); AUDIT
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit">
            The Participant represents and warrants to the IESO as follows, and
            acknowledges that the IESO is relying on such representations and
            warranties in entering into this Agreement:
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The performance and administration of this Agreement will be
              subject to the IESO EM&V Protocols. In furtherance of the IESO
              EM&V Protocols, the Participant will cooperate with the IESO and
              its respective designates and will make available such information
              in the form and with the frequency as may be reasonably
              prescribed, including with respect to historical electricity
              consumption.
            </Typography>
          </Typography>

          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant will keep complete and accurate books, accounts
              and records and all other data required by it for the purpose of
              proper administration, monitoring and verification of this
              Agreement, including Performance Incentives made under this
              Agreement, and all such records and data will be maintained during
              the term of this Agreement and for the period of time thereafter
              which is the greater of seven years and the period of time
              specified under Applicable Law. On reasonable notice, at any time
              during normal business hours, the Participant will provide
              reasonable access to the IESO and/or its respective designates to
              such books, accounts, records and data and:
            </Typography>
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 2,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (i)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  at the reasonable request of the IESO, make available to the
                  IESO and/or its respective designates, the personnel of the
                  Participant and its subcontractors involved in the operation
                  of the Participant’s business and the maintenance of such
                  books, accounts, records and data referred to above for the
                  purposes of this Section 8; and
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (ii)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  permit the IESO and/or its respective designates to examine
                  and audit and take copies and extracts from such documents and
                  to conduct site visits to inspect a Facility in order to
                  verify any of the information reported in a Savings Submission
                  and/or the payment of any Performance Incentive made
                  hereunder.
                </Typography>
              </Typography>
            </Stack>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Without limiting any other remedies of a party under this
              Agreement, if an audit or inspection conducted pursuant to this
              Section 8 discloses that there has been an overpayment or
              underpayment by the IESO or any misrepresentation or fraudulent
              activity by the Participant, the amount of the overpayment or
              underpayment will be payable or repayable to the IESO or to the
              Participant, as the case may be, promptly following such
              disclosure. In the case of an overpayment made by the IESO, the
              amount of such overpayment may be set-off against any future
              amounts payable to the Participant under this Agreement.
            </Typography>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          9. NO WARRANTY
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            Except as specifically set forth or referenced in this Agreement,
            there are no representations, warranties, or conditions of either
            Party, express, implied, statutory or otherwise, regarding any
            matter, including any implied warranties or conditions of quality or
            fitness for a particular purpose. Without limiting the generality of
            the foregoing, the Participant acknowledges that its participation
            in this Program is based on its own assessment of this Program and
            not on any reliance on anticipated or projected results, and that
            such participation may not result in the achievement of any
            electricity savings, which is expressly disclaimed by the
            Participant.
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          10. LIMITATION OF LIABILITY AND INDEMNITY
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              NOTWITHSTANDING ANYTHING CONTAINED HEREIN TO THE CONTRARY: (A) IN
              NO EVENT WILL THE PARTICIPANT BE ENTITLED TO RECOVER FROM THE IESO
              OR ANY OTHER INDEMNIFIED PARTY (AS DEFINED IN SECTION 10(b) BELOW)
              FOR ANY LIABILITIES, DAMAGES, OBLIGATIONS, PAYMENTS, LOSSES, COSTS
              OR EXPENSES UNDER OR IN RELATION TO THIS AGREEMENT:
              <Stack
                sx={{
                  display: "flex",
                  mt: 2,
                  flexDirection: "column",
                  ml: 2,
                }}
                spacing={2}
              >
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (i)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    ANY AMOUNT IN EXCESS OF THE ACTUAL COMPENSATORY DIRECT
                    DAMAGES, COURT COSTS AND REASONABLE LAWYERS’ AND OTHER
                    ADVISORS’ FEES SUFFERED OR INCURRED BY THE PARTICIPANT AND
                    IN ANY EVENT LIMITED TO THE FUNDING AMOUNT PAID BY THE IESO
                    HEREUNDER; OR
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (ii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    DAMAGES (WHETHER DIRECT OR INDIRECT, CONSEQUENTIAL OR
                    OTHERWISE) FOR (X) LOSS OF PROFIT, OR (Y) DIMINUTION OF
                    VALUE OR LOSS OF USE OF ANY PROPERTY; AND (B) THE IESO AND
                    THE INDEMNIFIED PARTIES (AS DEFINED IN SECTION 10(b) BELOW)
                    WILL NOT BE LIABLE TO THE PARTICIPANT, ITS SUCCESSORS OR
                    ASSIGNS OR ITS DIRECTORS, OFFICERS, EMPLOYEES, CONTRACTORS,
                    AGENTS OR REPRESENTATIVES, FOR ANY SPECIAL, INDIRECT,
                    INCIDENTAL, PUNITIVE, EXEMPLARY OR CONSEQUENTIAL DAMAGES
                    WHICH MAY ARISE UNDER OR IN RELATION TO THIS AGREEMENT,
                    REGARDLESS OF WHETHER SUCH LIABILITY ARISES UNDER CONTRACT,
                    TORT OR ANY OTHER LEGAL THEORY.
                  </Typography>
                </Typography>
              </Stack>
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant (the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Indemnifying Party”
              </Typography>{" "}
              ) will indemnify, defend and hold the IESO, the Government of
              Ontario, the members of the Government of Ontario’s Executive
              Council and their respective affiliates, and each of the foregoing
              Person’s respective directors, officers, employees, shareholders,
              advisors, third party service providers and agents (including
              contractors and their employees) (collectively, the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Indemnifying Party”
              </Typography>{" "}
              ) harmless from and against any and all Claims, losses, damages,
              liabilities, penalties, obligations, payments, costs and expenses
              and accrued interest thereon (including the costs and expenses of,
              and accrued interest on, any and all actions, suits, proceedings
              for personal injury (including death) or property damage,
              assessments, judgments, settlements and compromises relating
              thereto and reasonable lawyers’ fees and reasonable disbursements
              in connection therewith) (each, an{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Indemnifying Party”
              </Typography>{" "}
              ), asserted against or suffered by the Indemnified Party relating
              to, in connection with, resulting from, or arising out of
              <Stack
                sx={{
                  display: "flex",
                  mt: 2,
                  flexDirection: "column",
                  ml: 2,
                }}
                spacing={2}
              >
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (i)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    any Claim by, or occurrence or event related to, any third
                    party relating to this Agreement; and/or
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (ii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    the negligence or willful misconduct of the Participant,
                    except in either case to the extent that any injury or
                    damage related to such Claim, occurrence or event is
                    attributable to the negligence or willful misconduct of the
                    Indemnified Party. For greater certainty, in the event of
                    contributory negligence or willful misconduct of the
                    Indemnified Party, then such Indemnified Party will not be
                    indemnified hereunder in the proportion that the Indemnified
                    Party’s negligence or willful misconduct contributed to any
                    Indemnifiable Loss. The IESO will hold the benefit of the
                    Participant’s obligations under this Section 10 in the
                    IESO’s own right and, in trust, for the benefit of any other
                    Indemnified Party.
                  </Typography>
                </Typography>
              </Stack>
            </Typography>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          11. CONFIDENTIALITY AND PRIVACY
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Neither Party will use or disclose the Confidential Information of
              the other Party except as permitted or required by this Agreement.
              Subject to the foregoing, each Party will keep the other party’s
              Confidential Information confidential and secure using measures
              appropriate to the nature and sensitivity of such information.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Each Party may disclose Confidential Information of the other
              Party to the extent required by a Governmental Authority or as
              required by Applicable Law, subject to giving prior reasonable
              notice to the other Party of such compelled disclosure (except
              where prohibited by Applicable Law from doing so) so that the
              other Party may take such steps as it desires to challenge or
              contest such disclosure or seek a protective order.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Each Party may disclose Confidential Information on a need-to-know
              basis to:
              <Stack
                sx={{
                  display: "flex",
                  mt: 2,
                  flexDirection: "column",
                  ml: 2,
                }}
                spacing={2}
              >
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (i)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    its accountants, internal and external auditors and other
                    professional advisors;
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (ii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    potential permitted assignees or successors of such Party in
                    connection with a potential sale, merger, amalgamation or
                    other transaction or transfer involving the business, assets
                    or services provided by such party; and
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (iii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    directors, officers and employees of such Party and its
                    service providers, provided that any such person is notified
                    of the confidentiality of the Confidential Information and
                    of the provisions of this Section 11 and is subject to
                    written confidentiality obligations no less stringent than
                    those contained in this Section 11.
                  </Typography>
                </Typography>
              </Stack>
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (d)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The IESO may disclose Confidential Information of the Participant
              to the OEB, the Government of Ontario and the Office of the
              Auditor General of Ontario or their respective successors provided
              that the IESO notifies such person of the confidentiality of the
              Confidential Information.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (e)
            <Typography variant="small2" sx={{ pl: 1 }}>
              The Participant consents to the disclosure of:
              <Stack
                sx={{
                  display: "flex",
                  mt: 2,
                  flexDirection: "column",
                  ml: 2,
                }}
                spacing={2}
              >
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (i)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    aggregated data relating to its participation in this
                    Program;
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (ii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    its participation in this Program; and
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (iii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    the status and nature of the Eligible Measures undertaken
                    under this Program provided that the IESO shall provide ten
                    (10) Business Days’ notice to the Participant in advance of
                    such disclosure.
                  </Typography>
                </Typography>
              </Stack>
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (f)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Additionally, for each Facility, the Participant consents to the
              disclosure of the following information to the LDC and the local
              gas distributor servicing such Facility:
              <Stack
                sx={{
                  display: "flex",
                  mt: 2,
                  flexDirection: "column",
                  ml: 2,
                }}
                spacing={2}
              >
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (i)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    the address for such Facility;
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (ii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    the contact information (name, business telephone number and
                    e-mail address) for a contact person at the Participant
                    having knowledge of the Facility`s participation in the
                    Program;
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (iii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    information included in the Application via the EPP Portal
                    for such Facility; and
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (iv)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    the energy savings information for such Facility.
                  </Typography>
                </Typography>
              </Stack>
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (g)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Without limiting the foregoing, the Participant acknowledges and
              agrees that this Agreement and all Confidential Information in the
              possession or control of the IESO or the Participant are subject
              to Applicable Laws that include the access provisions of FIPPA and
              that as a result, third parties may obtain access to each Party’s
              Confidential Information. Moreover, the Participant acknowledges
              that the IESO and its Representatives are subject to FIPPA which
              applies to and governs all recorded information in any form or
              medium that is provided by the IESO or its Representatives to the
              Participant, or provided by the Participant to the IESO or its
              Representatives for the purposes of this Agreement, or created by
              the Participant in the performance of this Agreement, and that is
              in the custody or control of the IESO (collectively, the{" "}
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                “Records”
              </Typography>{" "}
              ), and may require the disclosure of the Records to third parties
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (h)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Each Party will:
              <Stack
                sx={{
                  display: "flex",
                  mt: 2,
                  flexDirection: "column",
                  ml: 2,
                }}
                spacing={2}
              >
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (i)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    comply with Privacy Laws in connection with the collection,
                    use and disclosure of Personal Information and will perform
                    its obligations so as to enable the other party to comply
                    with Applicable Law;
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (ii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    promptly notify the other Party if such Party receives
                    notice from any Governmental Authority alleging that either
                    Party has failed to comply with Privacy Laws and, or if such
                    Party otherwise becomes aware that either Party may have
                    failed or may fail to comply with Privacy Laws in connection
                    with the performance of this Agreement;
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (iii)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    cooperate and comply with any requests or instructions
                    issued by any privacy regulatory authority or any other
                    Governmental Authority applicable to such Party; and
                  </Typography>
                </Typography>
                <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                  (iv)
                  <Typography variant="small2" sx={{ pl: 1 }}>
                    provide reasonable assistance to the other Party in
                    responding to and addressing any complaint relating to the
                    collection, use or disclosure of Personal Information.
                  </Typography>
                </Typography>
              </Stack>
            </Typography>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          12. INJUNCTIVE RELIEF
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              Each Party acknowledges that, notwithstanding Section 5(b),
              Section 5(d) or Section 14, any violation of the provisions of
              Section 11 may cause irreparable damage or injury to the other
              Party, the exact amount of which may be impossible to ascertain,
              and that, for such reason, in addition to any other remedies
              available to such Party, such Party is entitled to proceed to
              court in order to obtain injunctive relief restraining the other
              party from breaching, and requiring the other Party to comply
              with, its obligations under Section 11. Nothing in this Section 12
              will be construed to limit the right of a party to obtain
              injunctive relief in any other circumstance in which it may be
              otherwise entitled to such relief.
            </Typography>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          13. FIPPA COMPLIANCE
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit">
            To the extent that the IESO must comply with disclosure obligations
            under FIPPA, the Participant agrees (without limiting its obligation
            set out in Section 11):
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              to keep the Records in its possession secure;
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              to provide the Records to the IESO within seven calendar days of
              being directed to do so by the IESO for any reason under FIPPA
              including an access request or privacy issue; and
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c)
            <Typography variant="small2" sx={{ pl: 1 }}>
              to implement other specific security measures that in the
              reasonable opinion of the IESO would improve the adequacy and
              effectiveness of the Participant’s measures to ensure, for the
              purposes of FIPPA, as applicable, the security and integrity of
              the Records held in the Participant’s possession.
            </Typography>
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          14. DISPUTE RESOLUTION
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            If any dispute arises under or in connection with this Agreement
            that the Parties cannot resolve, each of the Parties will promptly
            advise its senior management, in writing, of such dispute. Within
            ten (10) Business Days following delivery of such notice, a senior
            representative from each Party will meet, either in person or by
            telephone, to attempt to resolve the dispute. Each senior
            representative will be prepared to propose a solution to the
            dispute. If, following such efforts, the dispute is not resolved,
            the dispute will be settled by arbitration pursuant to Schedule “C”
            of this Agreement.
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          15. GENERAL PROVISIONS
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 2,
          }}
          spacing={2}
        >
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (a)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Headings.
              </Typography>{" "}
              The insertion of headings is for convenience of reference only and
              will not affect the interpretation of this Agreement. The terms
              “hereof”, “hereunder”, and similar expressions refer to this
              Agreement and not to any particular Article, Section, Schedule or
              other part hereof. Unless otherwise indicated, any reference in
              this Agreement to an Article, Section or Schedule refers to the
              specified article or section of, or schedule to, this Agreement.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (b)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Entire Agreement.
              </Typography>{" "}
              Except as otherwise provided, this Agreement constitutes the
              entire agreement between the Parties in connection with its
              subject matter and supersedes all prior representations,
              communications, negotiations and understandings, whether oral,
              written, express or implied, concerning the subject matter of this
              Agreement.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (c)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Amendments.
              </Typography>{" "}
              This Agreement may not be varied, amended or supplemented except
              by an agreement in writing signed by both of the Parties.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (d)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Governing Law and Attornment.
              </Typography>{" "}
              This Agreement will be governed by and construed in accordance
              with the laws of the Province of Ontario and the federal laws of
              Canada applicable therein. For the purpose of all legal
              proceedings, this Agreement will be deemed to have been made and
              performed in the Province of Ontario and the courts of the
              Province of Ontario will have exclusive jurisdiction to entertain
              any action arising under this Agreement. The IESO and the
              Participant each hereby attorns to the exclusive jurisdiction of
              the courts of the Province of Ontario.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (e)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Successors and Assigns.
              </Typography>{" "}
              This Agreement will enure to the benefit of and be binding upon
              the Participant and their respective successors and assigns. This
              Agreement may not be assigned by the Participant except with the
              prior written consent of the IESO, which consent may be
              unreasonably withheld or delayed.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (f)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Further Assurances.
              </Typography>{" "}
              Each of the Parties will, from time to time, on written request of
              the other Party, do all such further acts and execute and deliver
              or cause to be done, executed and delivered all such further
              things as may be reasonably required in order to fully perform and
              to more effectively implement the terms of this Agreement.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (g)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Severability.
              </Typography>{" "}
              The invalidity, unenforceability or illegality of any provision in
              this Agreement will not, to the extent permitted by Applicable
              Law, affect the validity, enforceability or legality of any other
              provision of this Agreement, which will remain in full force and
              effect.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (h)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                No Partnership, etc.
              </Typography>{" "}
              Nothing in this Agreement will be deemed to constitute a
              partnership or joint venture or create any fiduciary relationship
              between the IESO and the Participant.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (i)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Notices.
              </Typography>{" "}
              Notices. Any notice to be given under this Agreement unless
              expressly provided otherwise herein must be in writing and will be
              given by e-mail or by hand-delivery as provided. Any notice, if
              sent by e-mail, will be deemed to have been received on the
              Business Day following the sending, or if delivered by hand will
              be deemed to have been received on the Business Day is delivered
              to the applicable address noted below. Either Party may, by notice
              of change of address to the other Party, change its address to
              which notices are to be sent. Notices and other communications
              must be addressed as follows:
            </Typography>
            <Stack
              sx={{
                display: "flex",
                flexDirection: "column",
                mt: 2,
              }}
            >
              <Typography variant="small2">
                If to the Participant, to the address identified on the
                Participant’s profile page on the EPP Portal.
              </Typography>
              <Typography variant="small2" sx={{ mt: 2 }}>
                If to the IESO:
              </Typography>
              <Typography variant="small2" sx={{ mt: 2 }}>
                Enerva Energy Solutions Inc.
              </Typography>
              <Typography variant="small2">
                1 Adelaide Street East, Suite 3001
              </Typography>
              <Typography variant="small2">PO Box 201</Typography>
              <Typography variant="small2">Toronto, ON M5C 2V9</Typography>
              <Typography variant="small2" sx={{ mt: 2 }}>
                Attention: Energy Performance Program Support
              </Typography>
              <Typography variant="small2">
                E-mail:{" "}
                <Link variant="small2">info@energyperformanceprogram.ca</Link>
              </Typography>
              <Typography variant="small2" sx={{ mt: 2 }}>
                with a copy to:
              </Typography>
              <Typography variant="small2" sx={{ mt: 2 }}>
                Independent Electricity System Operator
              </Typography>
              <Typography variant="small2">
                120 Adelaide Street West, Suite 1600
              </Typography>
              <Typography variant="small2">Toronto, ON M5H 1T1</Typography>
              <Typography variant="small2" sx={{ mt: 2 }}>
                Attention: Manager, Business Program Performance - Custom
              </Typography>
              <Typography variant="small2">
                E-mail:{" "}
                <Link variant="small2">ConservationContracts@ieso.ca</Link>
              </Typography>
            </Stack>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (j)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Separation of Functions.
              </Typography>{" "}
              The Participant acknowledges and agrees that any actions or any
              notice delivered pursuant to this Agreement shall not be deemed to
              be notice for any other purpose, including any obligation to take
              action or to provide notice to the IESO pursuant to the IESO
              Market Rules.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (k)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                Signatures.
              </Typography>{" "}
              This Agreement may be executed and delivered by facsimile
              transmission or by any other method of electronic transmission.
              Any such signatures, including any contract formation on the EPP
              Portal or record-keeping through electronic means, may be relied
              upon by the Participant and the IESO and shall have the same legal
              effect, validity of enforceability as a manually executed
              signature, physical delivery thereof, or the use of a paper-based
              record-keeping system as the case may be.
            </Typography>
          </Typography>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            (l)
            <Typography variant="small2" sx={{ pl: 1 }}>
              <Typography variant="span2" sx={{ fontWeight: 600 }}>
                No Binding Obligations.
              </Typography>{" "}
              Prior to the issuance of the Notice of Approval, no binding
              obligations are created between the IESO and the Participant, and
              the IESO is not bound in any way to pay any Performance
              Incentives. Upon the issuance of the Notice of Approval, this
              Agreement shall be binding upon both Parties.
            </Typography>
          </Typography>

          <Typography variant="small2">
            I, the Participant, certify that I understand and agree to the terms
            and conditions as set forth above in this Agreement and agree to be
            bound by this Agreement upon the issuance of a Notice of Approval.
          </Typography>
          {/* <Typography variant="small2">
            PARTICIPANT / LEGAL COMPANY NAME:
          </Typography>
          <Typography variant="small2">AUTHORIZED SIGNATURE:</Typography>
          <Typography variant="small2">DATE:</Typography> */}
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 20, fontWeight: 600, fontSize: "1rem" }}
        >
          SCHEDULE “A” – DEFINITIONS
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
          }}
          spacing={2}
        >
          <Typography variant="small2">
            In this Agreement, the following terms will have the following
            meanings:
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Agreement”
            </Typography>{" "}
            means this Energy Performance Program Participant Agreement,
            including all recitals and Schedules, the Application and any
            additional documents approved by IESO hereunder, as it or they may
            be amended, restated or supplemented from time to time.
          </Typography>

          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Applicable Law” means:
            </Typography>{" "}
            (a) applicable multi-national, international, federal, provincial or
            municipal laws, orders-in-council, by-laws, codes, rules, policies,
            regulations and statutes; (b) applicable orders, decisions, codes,
            manuals, interpretation bulletins, judgments, injunctions, decrees,
            awards, directives, directions and writs of any court, tribunal,
            arbitrator, governmental authority or other Person having
            jurisdiction; (c) applicable rulings and conditions of any licence,
            permit, certificate, registration, authorization, consent and
            approval issued by a governmental authority; and (d) any
            requirements under or prescribed by applicable common law.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Application”
            </Typography>{" "}
            means a complete application for an incentive in respect of a
            Facility or Facilities under the Energy Performance Program
            submitted by a Participant via the EPP Portal to the IESO for
            approval
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Approved Meter”
            </Typography>{" "}
            means one of the following:
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 3,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (a)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  a meter that meets Measurement Canada requirements for revenue
                  billing, including approval by type, has been tested and
                  sealed by an accredited Measurement Canada meter shop, and has
                  had a Measurement Canada S-E-04 inspection by a firm
                  accredited by Measurement Canada for this work. The
                  Measurement Canada meter requirements can be found here:{" "}
                  <Link> Measurement Canada Meter Requirements</Link>
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (b)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  a meter that meets the following requirements:
                  <Stack
                    sx={{
                      display: "flex",
                      mt: 2,
                      flexDirection: "column",
                      ml: 3,
                    }}
                    spacing={2}
                  >
                    <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                      (i)
                      <Typography variant="small2" sx={{ pl: 1 }}>
                        is a solid-state, true root mean square, electric meter
                        or watt transducer;
                      </Typography>
                    </Typography>
                    <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                      (ii)
                      <Typography variant="small2" sx={{ pl: 1 }}>
                        has been calibrated and verified in accordance with the
                        manufacturer’s instructions to be accurate within +/-
                        0.5%;
                      </Typography>
                    </Typography>
                    <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                      (iii)
                      <Typography variant="small2" sx={{ pl: 1 }}>
                        and has been approved by the IESO, in its sole and
                        absolute discretion, for use at the Facility and for the
                        specific Eligible Measures being implemented as part of
                        the Energy Performance Program.
                      </Typography>
                    </Typography>
                  </Stack>
                </Typography>
              </Typography>
            </Stack>
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Baseline Energy Consumption”
            </Typography>{" "}
            means the actual electricity consumption for a Facility in the
            absence of Eligible Measures that is used to establish the Baseline
            Energy Models.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Baseline Energy Model”
            </Typography>{" "}
            means a statistical model generated for a Facility via the EPP
            Portal that predicts electricity consumption for that Facility over
            a set period of time, in accordance with the Baseline Energy Model
            Requirements found in the EPP Technical Guide.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Baseline Energy Model Requirements”
            </Typography>{" "}
            are the requirements for the Baseline Energy Model as set out in the
            EPP Technical Guide.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Business Day”
            </Typography>{" "}
            means a day, other than a Saturday or a Sunday or statutory holiday
            in the Province of Ontario or any other day on which banking
            institutions in Toronto, Ontario are not open for the transaction of
            business.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Claim”
            </Typography>{" "}
            means any actual, threatened or potential civil, criminal,
            administrative, regulatory, arbitral or investigative demand,
            allegation, action, suit, investigation or proceeding or any other
            claim or demand, whether in contract, tort or otherwise.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Confidential Information”
            </Typography>{" "}
            of a Party means all information relating to such Party or any of
            its affiliates, licensors, customers (including information
            regarding a customer that is a consumer, wholesaler or generator) or
            employees in connection with or as a result of entering into this
            Agreement, including information concerning the disclosing Party’s
            past, present or future customers, suppliers, technology, or
            business. Notwithstanding the foregoing, “Confidential Information”
            does not include information that is:
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 3,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (a)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  publicly available when it is received by or becomes known to
                  the other Party or that subsequently becomes publicly
                  available other than through an act or omission of the other
                  Party;
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (b)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  already known to the other Party at the time of disclosure and
                  is not known to the other party to be the subject of an
                  obligation of confidence;
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (c)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  independently developed by the other Party; or
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (d)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  received by the other Party in good faith without an
                  obligation of confidence of any kind by a third party;
                  provided, however, that, all personal information collected by
                  a Party or for which a party is responsible under Applicable
                  Law in connection with this Agreement is the Confidential
                  Information of that Party, whether or not it falls into one of
                  the exceptions set out in clause (A) through (D) of this
                  definition.
                </Typography>
              </Typography>
            </Stack>
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Distribution System”
            </Typography>{" "}
            means a system connected to the IESO-Controlled Grid for
            distributing electricity at voltages of 50 kV or less and includes
            any structures, equipment or other thing used for that purpose.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Effective Date”
            </Typography>{" "}
            means the date of issuance of the Notice of Approval.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Eligible Measures”
            </Typography>{" "}
            means any Measure as defined in Schedule “B” – Eligibility Criteria.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “EPP Portal”
            </Typography>{" "}
            means the IESO’s online portal for the Energy Performance Program
            used for, but not limited to, applying to the Program, enrolling
            Facilities, Baseline Energy Model generation, Savings Submissions,
            savings and incentive determination, Interim Savings Reports and
            invoice submissions.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              "EPP Technical Guide”
            </Typography>{" "}
            means a document provided by the IESO that may be updated from time
            to time that outlines program methodologies, specifications, and
            guidelines, including but not limited to, the determination of the
            baseline energy model, goodness
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Facility”
            </Typography>{" "}
            means the building(s), premises or lands, or part thereof, occupied
            by the Participant, and over which the Participant has all required
            authorization and consents to carry out its obligations under this
            Agreement and meeting the requirements in Schedule “B” – Eligibility
            Criteria.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “FIPPA”
            </Typography>{" "}
            means the{" "}
            <Typography variant="span2" sx={{ fontStyle: "italic" }}>
              Freedom of Information and Protection of Privacy Act
            </Typography>
            (Ontario)
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Governmental Authority”
            </Typography>{" "}
            means any federal, provincial, or municipal government, parliament
            or legislature, or any regulatory authority, agency, tribunal,
            commission, board or department of any such government, parliament
            or legislature, or any court or other law, regulation or rule-making
            entity, having jurisdiction in the relevant circumstances,
            including, without limitation, the IESO in its capacity as the
            operator of the IESO-Controlled Grid, the OEB, the Electrical Safety
            Authority, the Office of the Auditor General of Ontario, and any
            Person acting under the authority of any of the foregoing, but
            excluding the IESO.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “IESO”
            </Typography>{" "}
            means the Independent Electricity System Operator of Ontario
            established under Part II of the Electricity Act, 1998 (Ontario), or
            its successor or authorized agent.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “IESO-Controlled Grid”
            </Typography>{" "}
            has the meaning ascribed to it by the IESO Market Rules.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “IESO EM&V Protocols”
            </Typography>{" "}
            means the methods and processes that the IESO develops for the
            evaluation, measurement and verification of conservation and demand
            management programs and initiatives, and which may be found at{" "}
            <Link>
              https://www.ieso.ca/en/Sector-
              Participants/Energy-Efficiency/EvaluationMeasurement-and-Verification
            </Link>{" "}
            as such methods and processes may be amended from time to time.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “IESO Market Rules”
            </Typography>{" "}
            means the rules made under section 32 of the Electricity Act, 1998
            (Ontario), together with all market manuals, policies and guidelines
            issued by the IESO.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Incentive Cap”
            </Typography>{" "}
            has the meaning given to it in Section 3(b).
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Indemnifiable Loss”
            </Typography>{" "}
            has the meaning given to it in Section 10.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Indemnified Party”
            </Typography>{" "}
            has the meaning given to it in Section 10.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Indemnifying Party”
            </Typography>{" "}
            has the meaning given to it in Section 10.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Insolvent”,
            </Typography>{" "}
            in respect of a Person, means a Person:
            <Stack
              sx={{
                display: "flex",
                mt: 2,
                flexDirection: "column",
                ml: 3,
              }}
              spacing={2}
            >
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (a)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  who is for any reason unable to meet its obligations as they
                  generally become due or otherwise acknowledges its insolvency,
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (b)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  who has ceased paying its current obligations in the ordinary
                  course of business as they generally become due,
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (c)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  who has ceased to carry on business in the ordinary course,
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (d)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  who institutes any proceeding, takes any corporate action, or
                  executes any agreement to authorize its participation in or
                  the commencement of any proceeding seeking:
                  <Stack
                    sx={{
                      display: "flex",
                      mt: 2,
                      flexDirection: "column",
                      ml: 3,
                    }}
                    spacing={2}
                  >
                    <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                      (i)
                      <Typography variant="small2" sx={{ pl: 1 }}>
                        to adjudicate it a bankrupt or insolvent;
                      </Typography>
                    </Typography>
                    <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                      (ii)
                      <Typography variant="small2" sx={{ pl: 1 }}>
                        liquidation, dissolution, winding-up, reorganization,
                        arrangement, protection, relief or composition of it or
                        any of its property or debts or making a proposal with
                        respect to it under any law relating to bankruptcy,
                        insolvency, reorganization or compromise of debts or
                        other similar laws; or
                      </Typography>
                    </Typography>
                    <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                      (iii)
                      <Typography variant="small2" sx={{ pl: 1 }}>
                        appointment of a receiver, trustee, agent, custodian or
                        other similar official for it or for any substantial
                        part of its properties and assets, or
                      </Typography>
                    </Typography>
                  </Stack>
                </Typography>
              </Typography>
              <Typography variant="inherit" sx={{ fontWeight: 600 }}>
                (e)
                <Typography variant="small2" sx={{ pl: 1 }}>
                  the aggregate of whose property is not, at a fair valuation,
                  sufficient, or, if disposed of at a fairly conducted sale
                  under legal process, would not be sufficient to enable payment
                  of all its obligations, due and accruing due.
                </Typography>
              </Typography>
            </Stack>
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Interim Savings Reports”
            </Typography>{" "}
            means the EPP Portal reporting dashboard that presents the effects
            of installed measures and/or actions taken. It also captures any
            unexpected increase or decrease in energy savings, which are
            determined based on the uploaded electricity consumption data.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “LDC”
            </Typography>{" "}
            means a local electricity distribution company duly licensed by the
            OEB.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Material Adverse Effect”
            </Typography>{" "}
            means any change (or changes taken together) in, or effect on, the
            affected Party that materially and adversely affects the ability of
            such Party to perform its obligations under this Agreement.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Measures”
            </Typography>{" "}
            means (i) any activity undertaken for the primary purpose of
            obtaining or effecting, directly or indirectly, conservation and
            demand management, including the installation, retrofit,
            replacement, modification, commissioning or re-commissioning of
            equipment, systems, processes or behaviours that consume or result
            in the consumption of electricity; or (ii) any equipment, system or
            product related to the foregoing.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Minimum Savings”
            </Typography>{" "}
            has the meaning given to it in Section 2(c).
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              "Non-Routine Adjustment” or “NRA”
            </Typography>{" "}
            means a change to the Baseline Energy Models necessitated by a
            Non-Routine Event.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Non-Routine Event” or “NRE”
            </Typography>{" "}
            means certain changes to the Facility that significantly impact
            energy consumption but are unrelated to the Measures implemented and
            not otherwise addressed by the Baseline Energy Model. These changes
            could include modifications in the Facility size or the addition of
            new equipment, as further detailed in the EPP Technical Guide
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Notice of Approval”
            </Typography>{" "}
            means the notice issued by the Service Provider on behalf of IESO
            when the Participant has accepted the Baseline Energy Model for a
            Facility generated by the EPP Portal.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Off-Peak Electricity Consumption”
            </Typography>{" "}
            means electricity consumption that is not On-Peak Electricity
            Consumption.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Off-Peak Electricity Savings”
            </Typography>{" "}
            means the difference between the Off-Peak Electricity Consumption
            predicted for a Facility by the Baseline Energy Models over a
            Pay-for-Performance Period and the annual Off-Peak Electricity
            Consumption recorded by the Facility’s Approved Meter for the same
            Pay-forPerformance Period in accordance with the EPP Technical
            Guide. In the event of a dispute, the IESO’s evaluation of Off-Peak
            Electricity Savings will be final and binding.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Off-Peak Energy Incentive Rate”
            </Typography>{" "}
            means the dollar per kWh rate paid to the Participant for Off-Peak
            Electricity Savings as set out in section 3(a)(i) hereof.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “On-Peak Electricity Consumption”
            </Typography>{" "}
            means electricity consumption, measured in kWh, during peak period
            hours, as defined in the IESO’s Evaluation, Measurement and
            Verification Protocol V4.0. For clarity, this means energy consumed
            during Business Days between June 1 and August 31 (inclusive),
            during the hours of 1 pm and 7pm (EDT).
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “On-Peak Electricity Savings”
            </Typography>{" "}
            means the difference between the On-Peak Electricity Consumption
            predicted for a Facility by the Baseline Energy Models over a
            Pay-for-Performance Period and the annual On-Peak Electricity
            Consumption recorded by the Facility’s Approved Meter for the same
            Pay-forPerformance Period in accordance with the EPP Technical
            Guide. In the event of a dispute, the IESO’s evaluation of On-Peak
            Electricity Savings will be final and binding.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “On-Peak Energy Incentive Rate”
            </Typography>{" "}
            means the dollar per kWh rate paid to the Participant for On-Peak
            Electricity Savings as set out in section 3(a)(ii) hereof.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “OEB”
            </Typography>{" "}
            means the Ontario Energy Board or its successor.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Participant”
            </Typography>{" "}
            has the meaning given to it in the preamble of this Agreement.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Party” and “Parties”
            </Typography>{" "}
            means either the IESO or the Participant, or both, as applicable
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Past Programs”
            </Typography>{" "}
            has the meaning given to it in Section 1.4 of Schedule “B” hereto.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Pay-for-Performance Period”
            </Typography>{" "}
            means each 12-month period during which the Participant implements
            and/or maintains Eligible Measures for a Facility and during which
            Off-Peak Electricity Savings and OnPeak Electricity Savings will be
            measured, with the first such period for a Facility commencing on
            the date that the Participant accepts the Baseline Energy Model for
            a Facility and the next such period commencing immediately after the
            expiration of 12 months.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Performance Incentive”
            </Typography>{" "}
            means the amount to be paid to the Participant for each
            Pay-forPerformance Period as defined in Section 3(a)(i) and
            3(a)(ii).
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Person”
            </Typography>{" "}
            means a natural person, firm, trust, partnership, association,
            unincorporated organization, limited partnership, company or
            corporation (with or without share capital), joint venture, sole
            proprietorship, Governmental Authority or other entity of any kind.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Pre-Project Incentive”
            </Typography>{" "}
            has the meaning given to it in Section 1(d).
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Privacy Laws”
            </Typography>{" "}
            means all federal, provincial, state, municipal or other applicable
            statutes, laws or regulations of any Governmental Authority in any
            jurisdiction governing the Handling of information about an
            identifiable individual, including the{" "}
            <Typography variant="span2" sx={{ fontStyle: "italic" }}>
              Personal Information and Protection of Electronic Documents Act
              (Canada)
            </Typography>
            , FIPPA, MFIPPA and equivalent provincial legislation.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Program”
            </Typography>{" "}
            has the meaning given to it in the preamble to this Agreement.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Program Requirements”
            </Typography>{" "}
            means the program requirements for the Energy Performance Program,
            as made available by the IESO on the Save on Energy website as
            updated from time to time.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Records”
            </Typography>{" "}
            has the meaning given to it in Section 11(g).
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Representative”
            </Typography>{" "}
            means, in respect of one of the Parties, any one of that Party’s
            employees, officers, directors, shareholders, contractors, agents,
            representatives and advisors.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Save on Energy Program”
            </Typography>{" "}
            means any energy conservation programs funded by the IESO pursuant
            to the Ministerial Directives dated September 30, 2020 or March 21,
            2019 and as described on the Save on Energy web site found at
            <Link href=" https://www.saveonenergy.ca/" target="_blank">
              {" "}
              https://www.saveonenergy.ca/.
            </Link>
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Savings Report”
            </Typography>{" "}
            means a report generated by the EPP Portal based on the Facility
            energy data submitted annually by Participants evidencing the Total
            Electricity Savings achieved for a Facility during a given Pay-for-
            Performance Period.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Savings Submission”
            </Typography>{" "}
            means the Facility energy data provided by the Participant through
            the EPP Portal for each Pay-for-Performance Period in order for an
            annual Savings Report to be generated.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Service Provider”
            </Typography>{" "}
            means a third party retained by the IESO.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Term”
            </Typography>{" "}
            has the meaning given to it in Section 5(a).
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Total Electricity Savings”
            </Typography>{" "}
            means the sum of the Off-Peak Electricity Savings and the On-Peak
            Electricity Savings.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Website”
            </Typography>{" "}
            means the website located at the address:{" "}
            <Link href=" https://saveonenergy.ca" target="_blank">
              https://saveonenergy.ca
            </Link>{" "}
            or such other website as the IESO may notify the Participant of from
            time to time.
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 10, fontWeight: 600, fontSize: "1rem" }}
        >
          SCHEDULE “B” – ELIGIBILITY CRITERIA
        </Typography>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          1.1 PARTICIPANT ELIGIBILITY CRITERIA
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 3,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            To be an eligible Participant under the Program, a Person must:
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (a)
            </Typography>{" "}
            be an electricity consumer with one or more commercial,
            institutional, or industrial Facilities located in Ontario;
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (b)
            </Typography>{" "}
            commit to achieve at least five percent (5%) Total Electricity
            Savings per Facility by the end of the second Pay-for-Performance
            Period;
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (c)
            </Typography>{" "}
            have the required rights and authority to have the Eligible Measures
            installed at a Facility; and
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (d)
            </Typography>{" "}
            not be Insolvent.
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          1.2 FACILITY ELIGIBILITY CRITERIA
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 3,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            To be an eligible Facility, the proposed Facility must:
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (a)
            </Typography>{" "}
            have access to hourly interval meter data from an Approved Meter;
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (b)
            </Typography>{" "}
            have a minimum of 12 months of the most recent contiguous hourly
            interval data and, if requested, provide further data if any
            insufficiencies are found;
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (c)
            </Typography>{" "}
            have a {">"}50kW commercial account with an Approved Meter;
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (d)
            </Typography>{" "}
            have the Baseline Energy Models meeting the minimum standards stated
            in the EPP Technical Guide;
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (e)
            </Typography>{" "}
            be connected to, or behind the meter of, an electricity consumer
            connected to the IESOControlled Grid or a Distribution System; and
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (f)
            </Typography>{" "}
            meet any other eligibility programs as outlined in the EPP Technical
            Guide.
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          1.3 MEASURE ELIGIBILITY CRITERIA
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 3,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            Eligible Measures means any Measures implemented in a Facility, but
            specifically excluding:
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (a)
            </Typography>{" "}
            any Measures that are behind-the-meter generation projects;
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (b)
            </Typography>{" "}
            any Measures involving fuel-switching; or
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (c)
            </Typography>{" "}
            activities or measures promoted or funded through a different
            program or initiative designed to incentivize electricity savings
            and/or peak demand savings undertaken by the Government of Ontario
            or the IESO. Any projects receiving such electricity saving
            incentives will trigger a Baseline Adjustment at the discretion of
            the IESO.
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          1.4 PAST PROGRAM PARTICIPATION
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 3,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            For greater certainty, past participation in previous Energy
            Performance Programs or other programs or initiatives undertaken by
            the Government of Ontario or the IESO pursuant to Ministerial
            Directives other than the Ministerial Directive dated September 30,
            2020, as amended{" "}
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (“Past Programs”)
            </Typography>{" "}
            does not exclude the Participant from being eligible to participate
            in the Program, provided that any agreements in relation to Past
            Programs have expired or been terminated and new Baseline Energy
            Models are prepared for the Program which incorporate any energy or
            peak demand savings realized under Past Programs, in accordance with
            the EPP Technical Guide.
          </Typography>
        </Stack>
        <Typography
          variant="inherit"
          sx={{ mt: 10, fontWeight: 600, fontSize: "1rem" }}
        >
          SCHEDULE “C” – ARBITRATION PROVISIONS
        </Typography>
        <Stack
          sx={{
            display: "flex",
            fontSize: "0.875rem",
            mt: 2,
            flexDirection: "column",
            ml: 3,
          }}
          spacing={2}
        >
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              1.
            </Typography>{" "}
            Subject to and in accordance with the provisions of this Schedule
            “C”, any and all differences, disputes, Claims or controversies
            arising out of or in any way connected with this Agreement, whether
            arising before or after the expiration or termination of this
            Agreement, (including any dispute as to whether an issue is
            arbitrable) will be resolved by arbitration before a single
            arbitrator (the{" "}
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Arbitrator”
            </Typography>{" "}
            ) pursuant to the Arbitration Act, 1991 (Ontario) and otherwise in
            accordance with the laws of the Province of Ontario.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              2.
            </Typography>{" "}
            A Party desiring arbitration hereunder will give written notice of
            arbitration to the other Party containing a concise description of
            the matter submitted for arbitration{" "}
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              (“Notice of Arbitration”)
            </Typography>
            . If the Parties fail to jointly appoint an Arbitrator within 20
            days thereafter, an Arbitrator will be designated by a judge of the
            Ontario Superior Court of Justice upon application by either Party.
            The Arbitrator may determine all questions of law, fact and
            jurisdiction with respect to the dispute or the arbitration
            (including questions as to whether a dispute is arbitrable) and all
            matters of procedure relating to the arbitration. The Arbitrator may
            grant legal and equitable relief (including injunctive relief),
            award costs (including legal fees and the costs of the arbitration),
            and award interest.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              3.
            </Typography>{" "}
            The arbitration will be conducted in English in the City of Toronto
            (unless otherwise agreed to by the Parties) at such place therein
            and time as the Arbitrator may fix and, failing agreement thereto by
            the Parties, in accordance with such procedures as the Arbitrator
            will determine, in accordance with the principles of natural
            justice. The arbitration and all matters arising directly or
            indirectly therefrom will be kept strictly confidential by the
            Parties and will not be disclosed to any third party except as may
            be compelled by law.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              4.
            </Typography>{" "}
            The Arbitrator’s written decision will be delivered to each of the
            Parties within 60 days following the conclusion of the arbitration
            hearing. The costs of any arbitration hereunder will be borne by the
            Parties in the manner specified by the Arbitrator in his or her
            decision. The decision of the Arbitrator will be final and binding
            upon the Parties in respect of all matters relating to the
            arbitration, the conduct of the Parties during the proceedings and
            the final determination of the issues in the arbitration. There will
            be no appeal from the decision of the Arbitrator to any court,
            except on the grounds that the conduct of the Arbitrator, or the
            decision itself, violated the provisions of the Arbitration Act,
            1991 (Ontario), or solely on a question of law as provided for in
            such act. Judgment upon any award rendered by the Arbitrator may be
            entered in any court having jurisdiction thereof.
          </Typography>
          <Typography variant="small2">
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              5.
            </Typography>{" "}
            Submission to arbitration under this Schedule “C” is intended by the
            Parties to preclude any action in matters which may be arbitrated
            hereunder, save and except for enforcement of any arbitral award
            hereunder.
          </Typography>
        </Stack>
      </StyledContentWrapper>
    </Box>
  );
};

export default ParticipantAgreementContent;
