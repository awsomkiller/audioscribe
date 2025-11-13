"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, X, FileText, BarChart3, MessageCircle, Send, Play, Pause, Square, SkipBack, SkipForward, Download, Clipboard } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { DebugToggle } from "@/components/debug-toggle";

interface TranscriptSegment {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
}

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileName = searchParams.get("file") || "audio_file.mp3";

  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([
    {
      id: "1",
      speaker: "Speaker 1",
      timestamp: "00:01",
      text: "Welcome everyone to today's meeting. I'd like to start by discussing our quarterly objectives and the progress we've made so far."
    },
    {
      id: "2",
      speaker: "Speaker 2",
      timestamp: "00:15",
      text: "Thank you for organizing this. I have some updates on the marketing campaign that I think everyone should hear about."
    },
    {
      id: "3",
      speaker: "Speaker 1",
      timestamp: "00:28",
      text: "That sounds great. Please go ahead and share your updates with the team."
    },
    {
      id: "4",
      speaker: "Speaker 3",
      timestamp: "00:35",
      text: "Before we dive into marketing, can we quickly review the budget allocations? I have some concerns about the current spending."
    },
    {
      id: "5",
      speaker: "Speaker 2",
      timestamp: "00:48",
      text: "Of course, we can address the budget first. I think it's important that everyone is aligned on our financial priorities."
    }
  ]);

  const [editingSegment, setEditingSegment] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [speakerDialogOpen, setSpeakerDialogOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState("");
  const [newSpeakerName, setNewSpeakerName] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: "1", sender: "AI", message: "Hello! I can help you analyze this transcript. What would you like to know?" },
    { id: "2", sender: "User", message: "What are the main topics discussed?" },
    { id: "3", sender: "AI", message: "Based on the transcript, the main topics are: quarterly objectives, marketing campaign updates, and budget allocations." }
  ]);

  // Audio player state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Download dialog state
  const [fileFormat, setFileFormat] = useState("txt");
  const [downloadMp3, setDownloadMp3] = useState(false);
  const [splitOption, setSplitOption] = useState("paragraphs");
  const [paragraphSlider, setParagraphSlider] = useState([1]);
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [includeSpeakerLabels, setIncludeSpeakerLabels] = useState(false);

  const handleTextEdit = (segmentId: string, currentText: string) => {
    setEditingSegment(segmentId);
    setEditingText(currentText);
  };

  const handleSaveText = () => {
    if (editingSegment) {
      setTranscriptSegments(segments =>
        segments.map(segment =>
          segment.id === editingSegment
            ? { ...segment, text: editingText }
            : segment
        )
      );
      setEditingSegment(null);
      setEditingText("");
    }
  };

  const handleCancelTextEdit = () => {
    setEditingSegment(null);
    setEditingText("");
  };

  const handleSpeakerEdit = (currentSpeaker: string) => {
    setEditingSpeaker(currentSpeaker);
    setNewSpeakerName(currentSpeaker);
    setSpeakerDialogOpen(true);
  };

  const handleSaveSpeaker = () => {
    if (editingSpeaker && newSpeakerName) {
      setTranscriptSegments(segments =>
        segments.map(segment =>
          segment.speaker === editingSpeaker
            ? { ...segment, speaker: newSpeakerName }
            : segment
        )
      );
      setSpeakerDialogOpen(false);
      setEditingSpeaker("");
      setNewSpeakerName("");
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "User",
        message: chatMessage
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: "AI",
          message: "I understand your question. Let me analyze the transcript and provide you with relevant insights."
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  // Audio player handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const handleBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const handleForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDownloadTranscript = () => {
    // Format transcript as text
    const transcriptText = transcriptSegments
      .map((segment) => {
        return `[${segment.timestamp}] ${segment.speaker}: ${segment.text}`;
      })
      .join("\n\n");

    // Create blob and download
    const blob = new Blob([transcriptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName.replace(/\.[^/.]+$/, "")}_transcript.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed position toggles */}
      <div className="fixed top-4 right-4 flex gap-2 z-50">
        <ThemeToggle />
        <DebugToggle />
      </div>

      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-4 flex h-14 items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="mr-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">AudioScribe</h1>
            <span className="text-sm text-muted-foreground">{fileName}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Transcript */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transcript</CardTitle>
                    <CardDescription>
                      Click on speaker names or text to edit.
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Download</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-6 py-4">
                        {/* File Format Selection */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">File Format</Label>
                          <ToggleGroup
                            type="single"
                            value={fileFormat}
                            defaultValue="txt"
                            onValueChange={(value) => value && setFileFormat(value)}
                            className="grid grid-cols-3 gap-4"
                          >
                            <ToggleGroupItem value="pdf" aria-label="PDF" className="flex flex-col items-center gap-2 h-auto py-3">
                              <FileText size={16} />
                              <span>PDF</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="doc" aria-label="DOC" className="flex flex-col items-center gap-2 h-auto py-3">
                              <FileText size={16} />
                              <span>DOC</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="txt" aria-label="TXT" className="flex flex-col items-center gap-2 h-auto py-3">
                              <FileText size={16} />
                              <span>TXT</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="srt" aria-label="SRT" className="flex flex-col items-center gap-2 h-auto py-3">
                              <FileText size={16} />
                              <span>SRT</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="csv" aria-label="CSV" className="flex flex-col items-center gap-2 h-auto py-3">
                              <FileText size={16} />
                              <span>CSV</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="clipboard" aria-label="Clipboard" className="flex flex-col items-center gap-2 h-auto py-3">
                              <Clipboard size={16} />
                              <span>Clipboard</span>
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>

                        {/* MP3/MP4 Toggle */}
                        <div className="flex items-center justify-between">
                          <Label htmlFor="mp3-toggle">Download MP3/MP4</Label>
                          <Switch
                            id="mp3-toggle"
                            checked={downloadMp3}
                            onCheckedChange={setDownloadMp3}
                          />
                        </div>

                        {/* Split Options */}
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            Split Options: Choose how you want the text to be divided.
                          </p>
                          <RadioGroup
                            value={splitOption}
                            onValueChange={setSplitOption}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="single" id="r1" className="mt-0" />
                              <Label
                                htmlFor="r1"
                                className={`flex-1 cursor-pointer rounded-md border p-3 transition-colors ${
                                  splitOption === "single"
                                    ? "bg-accent border-primary"
                                    : "hover:bg-accent/50"
                                }`}
                              >
                                Don&apos;t Split (Single Paragraph)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="speaker" id="r2" className="mt-0" />
                              <Label
                                htmlFor="r2"
                                className={`flex-1 cursor-pointer rounded-md border p-3 transition-colors ${
                                  splitOption === "speaker"
                                    ? "bg-accent border-primary"
                                    : "hover:bg-accent/50"
                                }`}
                              >
                                Split by Speaker Names
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="paragraphs" id="r3" className="mt-0" />
                              <Label
                                htmlFor="r3"
                                className={`flex-1 cursor-pointer rounded-md border p-3 transition-colors ${
                                  splitOption === "paragraphs"
                                    ? "bg-accent border-primary"
                                    : "hover:bg-accent/50"
                                }`}
                              >
                                Split by Paragraphs
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Paragraph Slider */}
                        {splitOption === "paragraphs" && (
                          <div className="space-y-3 mb-4">
                            <Label>Paragraph Split Count</Label>
                            <Slider
                              value={paragraphSlider}
                              onValueChange={setParagraphSlider}
                              min={1}
                              max={8}
                              step={1}
                              className="w-full mt-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>1</span>
                              <span>2</span>
                              <span>4</span>
                              <span>8</span>
                            </div>
                          </div>
                        )}

                        {/* Timestamps & Speaker Labels Toggles */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="timestamps-toggle">Timestamps</Label>
                            <Switch
                              id="timestamps-toggle"
                              checked={includeTimestamps}
                              onCheckedChange={setIncludeTimestamps}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="speaker-labels-toggle">Speaker Labels</Label>
                            <Switch
                              id="speaker-labels-toggle"
                              checked={includeSpeakerLabels}
                              onCheckedChange={setIncludeSpeakerLabels}
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          className="w-full"
                          onClick={() => {
                            // Handle download with selected options
                            handleDownloadTranscript();
                          }}
                        >
                          Download
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {transcriptSegments.map((segment) => (
                  <div key={segment.id} className="border-l-2 border-muted pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSpeakerEdit(segment.speaker)}
                        className="h-auto p-1 font-medium text-primary hover:text-primary/80"
                      >
                        {segment.speaker}
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {segment.timestamp}
                      </span>
                    </div>
                    
                    {editingSegment === segment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveText}>
                            <Save className="mr-2 h-3 w-3" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelTextEdit}>
                            <X className="mr-2 h-3 w-3" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className="text-sm cursor-pointer hover:bg-muted/50 p-2 rounded"
                        onClick={() => handleTextEdit(segment.id, segment.text)}
                      >
                        {segment.text}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Features */}
          <div className="lg:sticky lg:top-20 lg:h-fit">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">
                  <FileText className="mr-2 h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This meeting transcript covers a team discussion about quarterly objectives and progress updates. 
                      The conversation includes updates on marketing campaigns and concerns about budget allocations. 
                      The team demonstrates good collaboration by addressing budget concerns before proceeding with 
                      marketing updates, showing alignment on financial priorities.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">Positive:</span>
                        <span className="text-muted-foreground">Team shows good collaboration and communication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-medium">Positive:</span>
                        <span className="text-muted-foreground">Structured approach to meeting agenda</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-600 font-medium">Concern:</span>
                        <span className="text-muted-foreground">Budget allocation issues need attention</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 font-medium">Action:</span>
                        <span className="text-muted-foreground">Marketing updates pending discussion</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-64 overflow-y-auto space-y-3 p-2 border rounded">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-2 rounded-lg text-xs ${
                              msg.sender === "User"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask about the transcript..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Speaker Edit Dialog */}
      <Dialog open={speakerDialogOpen} onOpenChange={setSpeakerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Speaker</DialogTitle>
            <DialogDescription>
              Changing &apos;{editingSpeaker}&apos; will update it everywhere in the transcript.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newSpeakerName}
            onChange={(e) => setNewSpeakerName(e.target.value)}
            placeholder="Enter new speaker name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSpeakerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSpeaker}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-2">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-none">
                <CardContent className="p-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleBackward}
                        className="h-8 w-8"
                      >
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={togglePlayPause}
                        className="h-10 w-10"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleStop}
                        className="h-8 w-8"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleForward}
                        className="h-8 w-8"
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <audio
                      ref={audioRef}
                      src={`https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`}
                      preload="metadata"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
