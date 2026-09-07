import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  FileText,
  Loader2,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Skeleton } from "~/components/ui/skeleton";

interface TipItem {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
}

interface CategoryFeedback {
  score: number;
  tips: TipItem[];
}

interface AnalysisResult {
  overallScore: number;
  ATS: CategoryFeedback;
  toneAndStyle: CategoryFeedback;
  content: CategoryFeedback;
  structure: CategoryFeedback;
  skills: CategoryFeedback;
}

interface DBResume {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumePath: string;
  feedback: AnalysisResult | null;
  createdAt: string;
}

const Resume = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [resume, setResume] = useState<DBResume | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        await Promise.all([
          new Promise((resolve) => setTimeout(resolve, 500)), // Simulate a 1-second delay
        ]);
        const res = await fetch(`http://localhost:3333/api/resumes/${id}`);
        const data = await res.json();
        if (res.ok) {
          setResume(data);
          setAnalysis(JSON.parse(data.feedback));
          console.log("Fetched analysis:", JSON.parse(data.feedback));
        }
      } catch (err) {
        console.error("Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Loader2 className="h-24 w-24 animate-spin" />
      </div>
    );
  }

  if (!resume || !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-xl font-bold text-red-500 mb-4">
          Analysis not found!
        </p>
        <Link
          to="/"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Go back home
        </Link>
      </div>
    );
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 texxt-green-800 hover:bg-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    return "bg-red-100 text-red-800 hover:bg-red-200";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "Optimized";
    if (score >= 60) return "Average";
    return "Needs Review";
  };

  const pdfURL = resume.resumePath?.replace(
    "./uploads/",
    "http://localhost:3333/uploads/",
  );
  const ResumePreview = lazy(() => import("~/components/ui/resumePreview"));

  function PdfSkeleton() {
    return (
      <div className="w-112.5 aspect-[1/1.41] relative rounded-md overflow-hidden bg-muted/40 border border-dashed border-muted-foreground/20 flex items-center justify-center">
        <Skeleton className="w-full h-full absolute inset-0" />
        <div className="relative z-10 flex items-center justify-center">
          <Loader2 className="h-24 w-24 animate-spin" />
        </div>
      </div>
    );
  }

  const getImprovementTips = () => {
    const atsTips = analysis.ATS.tips.filter((tip) => tip.type === "improve");
    const toneAndStyleTips = analysis.toneAndStyle.tips.filter(
      (tip) => tip.type === "improve",
    );
    const structureTips = analysis.structure.tips.filter(
      (tip) => tip.type === "improve",
    );
    const contentTips = analysis.content.tips.filter(
      (tip) => tip.type === "improve",
    );
    const skillsTips = analysis.skills.tips.filter(
      (tip) => tip.type === "improve",
    );

    return {
      atsTips,
      toneAndStyleTips,
      structureTips,
      contentTips,
      skillsTips,
    };
  };

  const handleDelete = async (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const res = await fetch(`http://localhost:3333/api/resumes/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to delete resume: ${res.status}`);
      }
      navigate(`/resumes/${data.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `An unknown error occurred: ${error}`;
      console.error("Error deleting resume:", error);
      setError(errorMessage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header Bar */}
      <header className=" border-b px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50 dark:bg-gray-950 min-h-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover: rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold animate-in fade-in duration-400">
              Job Title: {resume.jobTitle}
            </h1>
            <p className="text-sm animate-in fade-in duration-600">
              Applied to: {resume.companyName}
            </p>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start p-6 w-full mx-auto">
        {/* LEFT COLUMN: PDF View */}
        <section className="w-full lg:w-fit shrink-0 overflow-hidden">
          <Card className="hover:shadow-lg transition-all duration-300 border overflow-hidden relative cursor-pointer w-full max-w-md">
            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
              <div className="space-y-1 pr-4 w-full">
                <CardTitle className="text-lg font-bold flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} /> Original Resume
                  </div>
                  <a
                    href={pdfURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs hover:underline font-medium"
                  >
                    Open in new tab
                  </a>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-between">
              <Suspense fallback={<PdfSkeleton />}>
                <ResumePreview pdfUrl={pdfURL} />
              </Suspense>

              <div className="w-full flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar size={13} />
                  <span>{formatDate(resume.createdAt)}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={(e) => handleDelete(resume.id, e)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* RIGHT COLUMN: AI Feedback (Takes up 7/12 grid columns) */}
        <section className="flex-1 w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pr-2">
          {/* Overall & ATS Score Metrics */}
          <div className="flex flex-col gap-6">
            {/* Overall Score Circle */}
            <Card className="shadow-md">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold">
                  Resume Review
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center">
                    {/* Premium circular SVG indicator */}
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#f3f4f6"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={
                          analysis.overallScore >= 80
                            ? "#10b981"
                            : analysis.overallScore >= 50
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={351.8}
                        strokeDashoffset={
                          351.8 - (351.8 * analysis.overallScore) / 100
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-3xl font-extrabold">
                      {analysis.overallScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-center ">
                    {/* Score description */}
                    <div className="flex flex-col gap-1">
                      <h2 className="text-xl font-bold">Your Resume Score</h2>
                      <span>
                        This score is calculated based on the variables listed
                        below.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <p className="font-semibold mb-1">Tone & Style</p>
                    <Badge
                      className={`${getScoreBadgeColor(analysis.toneAndStyle.score)} px-3 py-1`}
                    >
                      {getScoreDescription(analysis.toneAndStyle.score)}
                    </Badge>
                  </div>
                  <span>{analysis.toneAndStyle.score}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <p className="font-semibold mb-1">Structure</p>
                    <Badge
                      className={`${getScoreBadgeColor(analysis.structure.score)} px-3 py-1`}
                    >
                      {getScoreDescription(analysis.structure.score)}
                    </Badge>
                  </div>
                  <span>{analysis.structure.score}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <p className="font-semibold mb-1">Content</p>
                    <Badge
                      className={`${getScoreBadgeColor(analysis.content.score)} px-3 py-1`}
                    >
                      {getScoreDescription(analysis.content.score)}
                    </Badge>
                  </div>
                  <span>{analysis.content.score}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <p className="font-semibold mb-1">Skills</p>
                    <Badge
                      className={`${getScoreBadgeColor(analysis.skills.score)} px-3 py-1`}
                    >
                      {getScoreDescription(analysis.skills.score)}
                    </Badge>
                  </div>
                  <span>{analysis.skills.score}/100</span>
                </div>
              </CardContent>
            </Card>

            {/* ATS Score Card */}
            <Card className="shadow-md">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold ">
                  ATS Score
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-extrabold ">
                    {analysis.ATS.score}/100
                  </span>
                  <Badge
                    className={`${getScoreBadgeColor(analysis.ATS.score)} text-sm px-3 py-1`}
                  >
                    {getScoreDescription(analysis.ATS.score)}
                  </Badge>
                </div>
                <span>
                  Your resume was scanned like an employer would. Here's how it
                  performed:
                </span>
                <div className="flex flex-col">
                  <ul className="flex flex-col items-start gap-4">
                    {analysis.ATS.tips.map((tip, index) => {
                      const isGoodTip = tip.type === "good";
                      return (
                        <li key={index} className="flex leading-relaxed gap-2">
                          <div className="shrink-0">
                            {isGoodTip ? (
                              <CheckCircle className="text-green-500 shrink-0" />
                            ) : (
                              <TriangleAlert className="text-yellow-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex flex-col gap-1 leading-relaxed">
                            <span
                              className={`font-semibold ${
                                isGoodTip
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-yellow-600 dark:text-yellow-400"
                              }`}
                            >
                              {tip.tip}
                            </span>
                            <p className="text-muted-foreground">
                              {tip.explanation}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            {/* Resume Feedback Card */}
            <Card className="shadow-md">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold ">
                  Resume Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center gap-4">
                {/* Tone & Style Tips List */}
                <Accordion type="multiple">
                  <AccordionItem
                    value="tone-and-style-tips"
                    className="border-b"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-4 w-full">
                        <span>Tone & Style</span>
                        <Badge
                          className={`${getScoreBadgeColor(analysis.toneAndStyle.score)} text-sm px-3 py-1`}
                        >
                          {analysis.toneAndStyle.score}/100
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent >
                      <div className="flex flex-col gap-4">
                        {analysis.toneAndStyle.tips.map((tip, index) => {
                          const isGoodTip = tip.type === "good";
                          return (
                            <div
                              key={index}
                              className={`flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-colors ${
                                isGoodTip
                                  ? "border-green-500/30 bg-green-500/10 text-foreground"
                                  : "border-yellow-500/30 bg-yellow-500/10 text-foreground"
                              } `}
                            >
                              <div className="shrink-0">
                                {isGoodTip ? (
                                  <CheckCircle className="text-green-500" />
                                ) : (
                                  <TriangleAlert className="text-yellow-500" />
                                )}
                              </div>
                              <div className="flex flex-col gap-1 leading-relaxed">
                                <span
                                  className={`font-semibold ${
                                    isGoodTip
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-yellow-600 dark:text-yellow-400"
                                  }`}
                                >
                                  {tip.tip}
                                </span>
                                {tip.explanation && (
                                  <p className="text-muted-foreground">
                                    {tip.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Structure Tips List */}
                <Accordion type="multiple">
                  <AccordionItem value="structure-tips" className="border-b">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-4 w-full">
                        <span>Structure</span>
                        <Badge
                          className={`${getScoreBadgeColor(analysis.structure.score)} text-sm px-3 py-1`}
                        >
                          {analysis.structure.score}/100
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4">
                        {analysis.structure.tips.map((tip, index) => {
                          const isGoodTip = tip.type === "good";
                          return (
                            <div
                              key={index}
                              className={`flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-colors ${
                                isGoodTip
                                  ? "border-green-500/30 bg-green-500/10 text-foreground"
                                  : "border-yellow-500/30 bg-yellow-500/10 text-foreground"
                              } `}
                            >
                              <div className="shrink-0">
                                {isGoodTip ? (
                                  <CheckCircle className="text-green-500" />
                                ) : (
                                  <TriangleAlert className="text-yellow-500" />
                                )}
                              </div>
                              <div className="flex flex-col gap-1 leading-relaxed">
                                <span
                                  className={`font-semibold ${
                                    isGoodTip
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-yellow-600 dark:text-yellow-400"
                                  }`}
                                >
                                  {tip.tip}
                                </span>
                                {tip.explanation && (
                                  <p className="text-muted-foreground">
                                    {tip.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Content Tips List */}
                <Accordion type="multiple">
                  <AccordionItem value="content-tips" className="border-b ">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-4 w-full">
                        <span>Content</span>
                        <Badge
                          className={`${getScoreBadgeColor(analysis.content.score)} text-sm px-3 py-1`}
                        >
                          {analysis.content.score}/100
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4">
                        {analysis.content.tips.map((tip, index) => {
                          const isGoodTip = tip.type === "good";
                          return (
                            <div
                              key={index}
                              className={`flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-colors ${
                                isGoodTip
                                  ? "border-green-500/30 bg-green-500/10 text-foreground"
                                  : "border-yellow-500/30 bg-yellow-500/10 text-foreground"
                              } `}
                            >
                              <div className="shrink-0">
                                {isGoodTip ? (
                                  <CheckCircle className="text-green-500" />
                                ) : (
                                  <TriangleAlert className="text-yellow-500" />
                                )}
                              </div>
                              <div className="flex flex-col gap-1 leading-relaxed">
                                <span
                                  className={`font-semibold ${
                                    isGoodTip
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-yellow-600 dark:text-yellow-400"
                                  }`}
                                >
                                  {tip.tip}
                                </span>
                                {tip.explanation && (
                                  <p className="text-muted-foreground">
                                    {tip.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Skills Tips List */}
                <Accordion type="multiple">
                  <AccordionItem
                    value="skills-tips"
                    className="border-b  last:border-b-0"
                  >
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-4 w-full">
                        <span>Skills</span>
                        <Badge
                          className={`${getScoreBadgeColor(analysis.skills.score)} text-sm px-3 py-1`}
                        >
                          {analysis.skills.score}/100
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4">
                        {analysis.skills.tips.map((tip, index) => {
                          const isGoodTip = tip.type === "good";
                          return (
                            <div
                              key={index}
                              className={`flex items-start gap-3 rounded-lg border p-4 shadow-sm transition-colors ${
                                isGoodTip
                                  ? "border-green-500/30 bg-green-500/10 text-foreground"
                                  : "border-yellow-500/30 bg-yellow-500/10 text-foreground"
                              } `}
                            >
                              <div className="shrink-0">
                                {isGoodTip ? (
                                  <CheckCircle className="text-green-500" />
                                ) : (
                                  <TriangleAlert className="text-yellow-500" />
                                )}
                              </div>
                              <div className="flex flex-col gap-1 leading-relaxed">
                                <span
                                  className={`font-semibold ${
                                    isGoodTip
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-yellow-600 dark:text-yellow-400"
                                  }`}
                                >
                                  {tip.tip}
                                </span>
                                {tip.explanation && (
                                  <p className="text-muted-foreground">
                                    {tip.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Resume Improvement Checklist */}
            <Card className="shadow-md">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-semibold ">
                  Improvement Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex flex-col">
                  <ul className="flex flex-col items-start gap-4">
                    {(
                      [
                        ...getImprovementTips().atsTips,
                        ...getImprovementTips().toneAndStyleTips,
                        ...getImprovementTips().structureTips,
                        ...getImprovementTips().contentTips,
                        ...getImprovementTips().skillsTips,
                      ] as TipItem[]
                    ).map((tip, index) => (
                      <li key={index} className="flex leading-relaxed gap-2">
                        <div className="flex flex-row items-center gap-3 leading-relaxed">
                          <Checkbox />
                          <span>{tip.tip}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resume;
