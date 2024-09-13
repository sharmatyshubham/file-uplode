



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";

export default function Form5() {
    const [name, setName] = useState("");
    const [gmail, setGmail] = useState("");
    const [password, setPassword] = useState("");
    const [videoLink, setVideoLink] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);

    
    const fetchUploadedFiles = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/mycoll");
            setUploadedFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchUploadedFiles(); 
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("gmail", gmail);
        formData.append("password", password);
        formData.append("videoLink", videoLink);
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:5000/api/mycoll", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setMessage("File uploaded successfully!");
            fetchUploadedFiles(); 
        } catch (error) {
            console.error("Error uploading file:", error);
            setMessage("An error occurred while uploading the file");
        }
    };

    const fileChange = (e) => setFile(e.target.files[0]);

    return (
        <Container component="main" maxWidth="xs" sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Card sx={{ padding: 3 }}>
                <CardContent>
                    <Typography variant="h5" component="h1" gutterBottom>
                        File Upload Form
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="gmail"
                            label="Gmail"
                            name="gmail"
                            autoComplete="email"
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="videoLink"
                            label="Video Link"
                            name="videoLink"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                        />
                        <input
                            type="file"
                            onChange={fileChange}
                            style={{ margin: '16px 0' }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Submit
                        </Button>
                    </form>
                    {message && <Typography color="textSecondary" variant="body2">{message}</Typography>}
                </CardContent>
            </Card>

            <div style={{ marginTop: 32 }}>
                <Typography variant="h6">Uploaded Files:</Typography>
                <Grid container spacing={2}>
                    {uploadedFiles.length > 0 ? (
                        uploadedFiles.map((uploadedFile) => (
                            <Grid item xs={12} sm={6} md={4} key={uploadedFile._id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="body2">{uploadedFile.name}</Typography>
                                    </CardContent>
                                    {uploadedFile.fileType && uploadedFile.fileType.startsWith("image/") ? (
                                        <CardMedia
                                            component="img"
                                            src={`http://localhost:5000/uploads/${uploadedFile.fileName}`}
                                            alt="Uploaded"
                                            height="140"
                                        />
                                    ) : uploadedFile.fileType && uploadedFile.fileType.startsWith("video/") ? (
                                        <CardMedia
                                            component="video"
                                            src={`http://localhost:5000/uploads/${uploadedFile.fileName}`}
                                            controls
                                            height="140"
                                        />
                                    ) : uploadedFile.fileType && uploadedFile.fileType.startsWith("application/pdf") ? (
                                        <CardMedia
                                            component="iframe"
                                            src={`http://localhost:5000/uploads/${uploadedFile.fileName}`}
                                            height="140"
                                        />
                                    ) : (
                                        <CardContent>
                                            <a href={`http://localhost:5000/uploads/${uploadedFile.fileName}`} download>
                                                Download {uploadedFile.fileName}
                                            </a>
                                        </CardContent>
                                    )}
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body2">No files uploaded yet.</Typography>
                    )}
                </Grid>
            </div>
        </Container>
    );
}
