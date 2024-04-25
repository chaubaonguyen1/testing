import React, { useEffect, useState } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Input,
  Checkbox,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { TabPanel } from "./components/TabPanel/TabPanel";
import { Ad, Campaign } from "./commons/interface";
import { EnumCampaign, initialCampaign } from "./commons/const";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    margin: theme.spacing(1),
  },
  cardContainer: {
    display: "flex",
    overflowX: "auto",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    maxWidth: "100%",
  },
  card: {
    marginRight: theme.spacing(1),
    cursor: "pointer",
    transition: "border-color 0.3s ease",
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: theme.spacing(1),
    minWidth: "200px",
  },
  selectedCard: {
    borderColor: theme.palette.primary.main,
  },
  addButton: {
    marginLeft: theme.spacing(1),
  },
  input: {
    margin: theme.spacing(1),
    width: 200,
  },
  statusActive: {
    color: theme.palette.success.main,
  },
  statusInactive: {
    color: theme.palette.error.main,
  },
  listContainer: {
    marginBottom: theme.spacing(2),
  },
  headerItem: {
    fontWeight: "bold",
  },
}));

const App: React.FunctionComponent = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign);
  const [selectedSubCampaignIndex, setSelectedSubCampaignIndex] =
    useState<number>(0);
  const [editSubCampaignName, setEditSubCampaignName] = useState<string>("");
  const [editSubCampaignStatus, setEditSubCampaignStatus] =
    useState<boolean>(true);
  const [newAdName, setNewAdName] = useState<string>("");
  const [checkAllAds, setCheckAllAds] = useState<boolean>(false);
  const [campaignNameError, setCampaignNameError] = useState<string>("");
  const [adNameErrors, setAdNameErrors] = useState<string[]>([]);
  const [quantityErrors, setQuantityErrors] = useState<string[]>([]);

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const updateAllAdsSelected = (): void => {
    const selectedSubCampaign = campaign.subCampaigns[selectedSubCampaignIndex];
    const allSelected = selectedSubCampaign.ads.every((ad) => ad.isChosen);
    setCheckAllAds(allSelected);
  };

  useEffect(() => {
    updateAllAdsSelected();
  }, [campaign.subCampaigns[selectedSubCampaignIndex].ads]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCampaign((prevState) => ({
      ...prevState,
      information: {
        ...prevState.information,
        [name]: value,
      },
    }));
  };
  const handler = {
    onSelectSubCampaign: (index: number): void => {
      setSelectedSubCampaignIndex(
        index === selectedSubCampaignIndex ? 0 : index
      );
      setEditSubCampaignName(campaign.subCampaigns[index].name); // Set the name of the selected sub campaign in the input
      setEditSubCampaignStatus(campaign.subCampaigns[index].status); // Set the status of the selected sub campaign in the checkbox
    },
    onEditSubCampaignName: (e: React.ChangeEvent<HTMLInputElement>): void => {
      setEditSubCampaignName(e.target.value); // Update the edited name of the sub campaign
      if (selectedSubCampaignIndex !== null) {
        const updatedSubCampaigns = [...campaign.subCampaigns];
        updatedSubCampaigns[selectedSubCampaignIndex].name = e.target.value;
        setCampaign((prevState) => ({
          ...prevState,
          subCampaigns: updatedSubCampaigns,
        }));
      }
    },
    onToggleSubCampaignStatus: (
      e: React.ChangeEvent<HTMLInputElement>
    ): void => {
      const status = e.target.checked;
      setEditSubCampaignStatus(status); // Update the status of the sub campaign
      if (selectedSubCampaignIndex !== null) {
        const updatedSubCampaigns = [...campaign.subCampaigns];
        updatedSubCampaigns[selectedSubCampaignIndex].status = status;
        setCampaign((prevState) => ({
          ...prevState,
          subCampaigns: updatedSubCampaigns,
        }));
      }
    },
    onAddSubCampaign: (): void => {
      setCampaign((prevState) => ({
        ...prevState,
        subCampaigns: [
          ...prevState.subCampaigns,
          {
            name: `Sub Campaign ${prevState.subCampaigns.length + 1}`,
            status: true,
            ads: [
              {
                name: "",
                quantity: 0,
                isChosen: false,
              },
            ],
          },
        ],
      }));
    },
    onAddAds: (): void => {
      if (selectedSubCampaignIndex !== null) {
        const updatedSubCampaigns = [...campaign.subCampaigns];
        updatedSubCampaigns[selectedSubCampaignIndex].ads.push({
          name: newAdName,
          quantity: 0,
          isChosen: false,
        });
        setCampaign((prevState) => ({
          ...prevState,
          subCampaigns: updatedSubCampaigns,
        }));
        setNewAdName("");
      }
    },
    onRemoveAds: (index: number): void => {
      const updatedSubCampaigns = [...campaign.subCampaigns];
      const filteredAds = campaign.subCampaigns[
        selectedSubCampaignIndex
      ].ads.filter((_, i) => i !== index);
      updatedSubCampaigns[selectedSubCampaignIndex].ads = filteredAds;
      setCampaign((prevState) => ({
        ...prevState,
        subCampaigns: updatedSubCampaigns,
      }));
    },
    onToggleAllAds: (): void => {
      setCheckAllAds((prevState) => !prevState);
      const updatedSubCampaigns = [...campaign.subCampaigns];
      const selectedSubCampaign = updatedSubCampaigns[selectedSubCampaignIndex];
      const newAds = selectedSubCampaign.ads.map((ad) => ({
        ...ad,
        isChosen: !checkAllAds,
      }));
      selectedSubCampaign.ads = newAds;
      setCampaign((prevState) => ({
        ...prevState,
        subCampaigns: updatedSubCampaigns,
      }));
    },
    onDeleteSelectedAds: (): void => {
      const updatedSubCampaigns = [...campaign.subCampaigns];
      const filteredAds = campaign.subCampaigns[
        selectedSubCampaignIndex
      ].ads.filter((item) => !item.isChosen);
      updatedSubCampaigns[selectedSubCampaignIndex].ads = filteredAds;
      setCampaign((prevState) => ({
        ...prevState,
        subCampaigns: updatedSubCampaigns,
      }));
      setCheckAllAds(false);
    },
    onChooseIndividualAd: (index: number): void => {
      const updatedSubCampaigns = [...campaign.subCampaigns];
      const updatedAds = [...updatedSubCampaigns[selectedSubCampaignIndex].ads];
      updatedAds[index].isChosen = !updatedAds[index].isChosen;
      updatedSubCampaigns[selectedSubCampaignIndex].ads = updatedAds;
      setCampaign((prevState) => ({
        ...prevState,
        subCampaigns: updatedSubCampaigns,
      }));
      updateAllAdsSelected();
    },
    onUpdateValues: (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ): void => {
      const { name, value } = e.target;
      let error = "";

      if (name === EnumCampaign.AdName) {
        error = value ? "" : "Ad Name is required";
      } else if (name === EnumCampaign.Quantity) {
        error = +value > 0 ? "" : "Quantity must be greater than 0";
      }

      // Update the respective error state based on the field name
      if (name === EnumCampaign.AdName) {
        const updatedErrors = [...adNameErrors];
        updatedErrors[index] = error;
        setAdNameErrors(updatedErrors);
      } else if (name === EnumCampaign.Quantity) {
        const updatedErrors = [...quantityErrors];
        updatedErrors[index] = error;
        setQuantityErrors(updatedErrors);
      }

      // Update the state with the new value if the name is a valid key
      if (name === EnumCampaign.AdName || name === EnumCampaign.Quantity) {
        const updatedSubCampaigns = [...campaign.subCampaigns];
        const updatedAds = [
          ...updatedSubCampaigns[selectedSubCampaignIndex].ads,
        ];
        updatedAds[index][name as keyof Ad] = value; // Type assertion
        updatedSubCampaigns[selectedSubCampaignIndex].ads = updatedAds;
        setCampaign((prevState) => ({
          ...prevState,
          subCampaigns: updatedSubCampaigns,
        }));
      }
    },
    onSubmit: (): void => {
      // Clear previous errors
      setCampaignNameError("");
      setAdNameErrors([]);
      setQuantityErrors([]);

      // Validation logic
      let isValid = true;

      // Validate Campaign Name
      if (!campaign.information.name) {
        isValid = false;
        setCampaignNameError("Campaign Name is required");
        alert("Please fill in the mandatory fields");
      }

      // Validate Ad Names and Quantities
      campaign.subCampaigns.forEach((subCampaign) => {
        subCampaign.ads.forEach((ad) => {
          if (!ad.name) {
            isValid = false;
            setAdNameErrors((prevErrors) => [
              ...prevErrors,
              "This field is required!",
            ]);
          }
          if (ad.quantity <= 0) {
            isValid = false;
            setQuantityErrors((prevErrors) => [
              ...prevErrors,
              "This must be greater than 0!",
            ]);
          }
        });
      });

      // If form is valid, submit
      if (isValid) {
        // Handle form submission here
        const currentCampaign = campaign.subCampaigns[selectedSubCampaignIndex];
        alert(
          `Form submitted successfully: ${JSON.stringify(currentCampaign)}`
        );
      } else {
        console.error("Form submission failed due to validation errors");
      }
    },
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleChangeTab}>
          <Tab label="Information" />
          <Tab label="Sub Campaigns" />
        </Tabs>
      </AppBar>
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Campaign Name"
              value={campaign.information.name}
              onChange={handleInputChange}
              error={!!campaignNameError}
              helperText={campaignNameError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="describe"
              label="Description"
              value={campaign.information.describe}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <div className={classes.cardContainer}>
          <Grid container spacing={2} style={{ flexWrap: "nowrap" }}>
            {campaign.subCampaigns.map((subCampaign, index) => (
              <Grid item key={index}>
                <Card
                  className={`${classes.card} ${
                    selectedSubCampaignIndex === index
                      ? classes.selectedCard
                      : ""
                  }`}
                  onClick={() => handler.onSelectSubCampaign(index)}
                >
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {subCampaign.name}
                    </Typography>
                    <Typography
                      className={
                        subCampaign.status
                          ? classes.statusActive
                          : classes.statusInactive
                      }
                    >
                      Status: {subCampaign.status ? "Active" : "Not Active"}
                    </Typography>
                    <Typography variant="body2" component="p">
                      Number of Ads: {subCampaign.ads.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        <IconButton
          className={classes.addButton}
          color="primary"
          aria-label="add sub campaign"
          onClick={handler.onAddSubCampaign}
        >
          <AddIcon />
        </IconButton>
        {selectedSubCampaignIndex !== null && (
          <div>
            <Input
              className={classes.input}
              value={editSubCampaignName}
              onChange={handler.onEditSubCampaignName}
            />
            <Checkbox
              checked={editSubCampaignStatus}
              onChange={handler.onToggleSubCampaignStatus}
              color="primary"
            />
            <Typography variant="body2" component="span">
              {editSubCampaignStatus ? "Active" : "Not Active"}
            </Typography>
          </div>
        )}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={checkAllAds}
                    onClick={handler.onToggleAllAds}
                  />
                </TableCell>
                {!checkAllAds ? (
                  <>
                    <TableCell align="left">Advertisement Name</TableCell>
                    <TableCell align="left">Quantity</TableCell>
                  </>
                ) : (
                  <TableCell align="left" colSpan={2}>
                    <IconButton
                      className={classes.addButton}
                      color="primary"
                      aria-label="delete selected ads"
                      onClick={handler.onDeleteSelectedAds}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
                <TableCell>
                  <IconButton
                    className={classes.addButton}
                    color="primary"
                    aria-label="add ad"
                    onClick={handler.onAddAds}
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaign.subCampaigns[selectedSubCampaignIndex].ads.map(
                (ad, index: number) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      style={
                        checkAllAds
                          ? { backgroundColor: "rgba(254,235,242,255)" }
                          : {}
                      }
                    >
                      <Checkbox
                        color="primary"
                        checked={ad.isChosen}
                        onClick={() => handler.onChooseIndividualAd(index)}
                      />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={
                        checkAllAds
                          ? { backgroundColor: "rgba(254,235,242,255)" }
                          : {}
                      }
                    >
                      <Tooltip
                        title={adNameErrors[index]}
                        open={!!adNameErrors[index]}
                        arrow
                      >
                        <TextField
                          className={classes.input}
                          label="Ad Name"
                          name={EnumCampaign.AdName}
                          value={ad.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handler.onUpdateValues(e, index)
                          }
                          error={adNameErrors[index] ? true : false}
                          helperText={adNameErrors[index]}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      align="left"
                      style={
                        checkAllAds
                          ? { backgroundColor: "rgba(254,235,242,255)" }
                          : {}
                      }
                    >
                      <Tooltip
                        title={adNameErrors[index]}
                        open={!!adNameErrors[index]}
                        arrow
                      >
                        <TextField
                          className={classes.input}
                          label={EnumCampaign.Quantity}
                          type="number"
                          name={EnumCampaign.Quantity}
                          value={ad.quantity}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handler.onUpdateValues(e, index)
                          }
                          error={quantityErrors[index] ? true : false}
                          helperText={quantityErrors[index]}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      style={
                        checkAllAds
                          ? { backgroundColor: "rgba(254,235,242,255)" }
                          : {}
                      }
                    >
                      <IconButton
                        className={classes.addButton}
                        color="primary"
                        aria-label="Delete ad"
                        onClick={() => handler.onRemoveAds(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handler.onSubmit}
      >
        Submit
      </Button>
    </div>
  );
};

export default App;
