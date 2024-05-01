import { Typography, Box, styled } from "@mui/material";

const StyledContentWrapper = styled(Box)(({ theme }) => ({
  maxHeight: "50vh",
  overflowY: "auto",
  padding: theme.spacing(2),
  background: "#F5FFF7",
}));

const ParticipantAgreementContent = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        pt: "2rem",
      }}
    >
      <StyledContentWrapper>
        <Typography variant="inherit" sx={{ fontSize: "0.875rem" }}>
          The Participant (being the “Applicant” in the Application) has applied
          for Performance Incentives, in respect of electricity savings achieved
          at one or more Facilities through operational and maintenance energy
          efficiency measures and equipment retrofits, pursuant to the
          Application submitted to the IESO under the Save on Energy - Energy
          Performance Program (the “EPP” or the “Program”) in accordance with
          the Program Requirements. All capitalized terms not defined herein
          will have the meanings given to them in Schedule A to this Agreement.
          In consideration of the Performance Incentives being provided and
          other good and valuable consideration the receipt and sufficiency of
          which are hereby acknowledged, the Participant agrees to the following
          terms and conditions:
        </Typography>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          1. BASELINE ENERGY MODEL AND PRE-PROJECT INCENTIVE
        </Typography>
        <Box sx={{ display: "flex", fontSize: "0.875rem", mt: 2 }}>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            a.
          </Typography>
          <Typography variant="inherit" sx={{ pl: 1 }}>
            Upon acceptance of the Baseline Energy Model generated via the EPP
            Portal and issuance of a Notice of Approval, the Facility will be
            deemed accepted into the Program, and the Participant shall be
            entitled to receive an optional, one-time advance of part of its
            anticipated Performance Incentive for such Facility, calculated as
            follows: Baseline Energy Consumption * 2.5% * $0.04/kWh (the
            “Pre-Project Incentive”). Payment of the Pre-Project Incentive
            hereunder is conditional upon the Participant providing an invoice
            detailing the Facility which has been approved by the IESO and such
            additional information as prescribed by IESO to substantiate the
            payment.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", fontSize: "0.875rem", mt: 2 }}>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            b.
          </Typography>
          <Typography variant="inherit" sx={{ pl: 1 }}>
            AdditionalFacilitiesmaybeincludedforparticipationintheProgramfromtimetotimeduring
            the Term by the Participant submitting the required Facility
            information via the EPP Portal and accepting the Baseline Energy
            Model generated for such Facility, provided that no new Facilities
            will be accepted after December 31, 2024.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", fontSize: "0.875rem", mt: 2 }}>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            c.
          </Typography>
          <Typography variant="inherit" sx={{ pl: 1 }}>
            The Participant shall be required to report any Non-Routine Event
            (NRE) to the Service Provider via the EPP Portal as soon as they
            become aware of such event. The nature of the event (e.g., temporary
            or permanent), the dates, and an explanation of the event should be
            provided. In addition, the Participant is required to submit a
            request for a Non-Routine Adjustment (NRA) within 60 days of
            becoming aware of such NRE. In the event of disagreement as to
            whether an event constitutes a Non-Routine Event, the opinion of the
            IESO shall govern.
          </Typography>
        </Box>
        <Typography
          variant="inherit"
          sx={{ mt: 2, fontWeight: 600, fontSize: "1rem" }}
        >
          2. PARTICIPANT OBLIGATIONS, ELIGIBLE MEASURES AND SAVINGS SUBMISSION
        </Typography>
        <Box sx={{ display: "flex", fontSize: "0.875rem", mt: 2 }}>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            1.
          </Typography>
          <Typography variant="inherit" sx={{ pl: 1 }}>
            Subject to and in accordance with the provisions of this Schedule
            “C”, any and all differences, disputes, Claims or controversies
            arising out of or in any way connected with this Agreement, whether
            arising before or after the expiration or termination of this
            Agreement, (including any dispute as to whether an issue is
            arbitrable) will be resolved by arbitration before a single
            arbitrator (the{" "}
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Arbitrator”
            </Typography>
            ) pursuant to the Arbitration Act, 1991 (Ontario) and otherwise in
            accordance with the laws of the Province of Ontario.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", fontSize: "0.875rem", mt: 2 }}>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            2.
          </Typography>
          <Typography variant="inherit" sx={{ pl: 1 }}>
            A Party desiring arbitration hereunder will give written notice of
            arbitration to the other Party containing a concise description of
            the matter submitted for arbitration ({" "}
            <Typography variant="span2" sx={{ fontWeight: 600 }}>
              “Notice of Arbitration”
            </Typography>
            ). If the Parties fail to jointly appoint an Arbitrator within 20
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
        </Box>
        <Box sx={{ display: "flex", fontSize: "0.875rem", mt: 2 }}>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            3.
          </Typography>
          <Typography variant="inherit" sx={{ pl: 1 }}>
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
        </Box>
        <Box sx={{ display: "flex", fontSize: "0.875rem", mt: 2 }}>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            4.
          </Typography>
          <Typography variant="inherit" sx={{ pl: 1 }}>
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
        </Box>
        <Box sx={{ display: "flex", fontSize: "0.875rem", mt: 2 }}>
          <Typography variant="inherit" sx={{ fontWeight: 600 }}>
            5.
          </Typography>
          <Typography variant="inherit" sx={{ pl: 1 }}>
            Submission to arbitration under this Schedule “C” is intended by the
            Parties to preclude any action in matters which may be arbitrated
            hereunder, save and except for enforcement of any arbitral award
            hereunder.
          </Typography>
        </Box>
      </StyledContentWrapper>
    </Box>
  );
};

export default ParticipantAgreementContent;
