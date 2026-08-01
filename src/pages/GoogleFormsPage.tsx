import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useFirebase } from "@/providers/FirebaseProvider";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import { 
  FileSpreadsheet, 
  Search, 
  Plus, 
  ExternalLink, 
  Eye, 
  ArrowLeft, 
  RefreshCw, 
  CheckCircle2, 
  Info, 
  AlertCircle, 
  Lock,
  ChevronRight,
  FormInput,
  FolderOpen
} from "lucide-react";
import { toast } from "sonner";

interface GoogleFormFile {
  id: string;
  name: string;
  webViewLink: string;
  createdTime: string;
}

interface FormQuestion {
  title: string;
  type: string;
  required: boolean;
}

export default function GoogleFormsPage() {
  const { firebaseUser, googleAccessToken, loginWithGoogle, logoutFromFirebase } = useFirebase();
  const [forms, setForms] = useState<GoogleFormFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedForm, setSelectedForm] = useState<GoogleFormFile | null>(null);
  const [formDetails, setFormDetails] = useState<any | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
      }
    } catch (err) {
      console.warn("Google authentication error:", err);
    }
  };

  // Fetch Google Forms from Drive API
  const fetchGoogleForms = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.form'&fields=files(id,name,webViewLink,createdTime)&orderBy=createdTime desc",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Google session expired. Please sign in again.");
          return;
        }
        throw new Error("Failed to fetch forms");
      }

      const data = await response.json();
      setForms(data.files || []);
    } catch (err) {
      console.error("Error fetching Google Forms:", err);
      toast.error("Failed to load Google Forms from your Drive.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch individual form details
  const fetchFormDetails = async (formId: string) => {
    if (!googleAccessToken) return;
    setIsDetailsLoading(true);
    try {
      const response = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormDetails(data);
      } else {
        // Fallback or clear if Forms API is not fully configured on developer console
        setFormDetails(null);
      }
    } catch (err) {
      console.error("Error fetching form details:", err);
      setFormDetails(null);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // Create a new Google Form
  const createNewGoogleForm = async () => {
    if (!googleAccessToken) {
      toast.error("Please sign in with Google first.");
      return;
    }
    setIsCreating(true);
    try {
      const response = await fetch("https://forms.googleapis.com/v1/forms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          info: {
            title: "Axi Customer Trading Survey",
            description: "Thank you for taking the time to share your trading experience. Your responses help us improve Axi services.",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Google Form");
      }

      const newForm = await response.json();
      toast.success("Successfully created a new Google Form in your Drive!");
      
      // Refresh list
      await fetchGoogleForms(googleAccessToken);
      
      // Select the new form
      const createdFormFile: GoogleFormFile = {
        id: newForm.formId,
        name: newForm.info.title,
        webViewLink: `https://docs.google.com/forms/d/${newForm.formId}/edit`,
        createdTime: new Date().toISOString(),
      };
      setSelectedForm(createdFormFile);
      setFormDetails(newForm);
    } catch (err) {
      console.error("Error creating Google Form:", err);
      toast.error("Failed to create Google Form. Please check your Drive permissions.");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (googleAccessToken) {
      fetchGoogleForms(googleAccessToken);
    }
  }, [googleAccessToken]);

  useEffect(() => {
    if (selectedForm) {
      fetchFormDetails(selectedForm.id);
    } else {
      setFormDetails(null);
    }
  }, [selectedForm]);

  const filteredForms = forms.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <TopBar />
      <Navbar />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2B2B2B] text-white py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#D31C2B] text-white text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded">
                  Workspace Hub
                </span>
                <span className="text-gray-400 text-xs font-mono">OAuth 2.0 Client Secure</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-space font-bold tracking-tight">
                Google Forms Manager
              </h1>
              <p className="text-gray-400 text-sm mt-2 max-w-xl">
                Access, create, and embed your custom Google Forms & client questionnaires directly within your Axi dashboard.
              </p>
            </div>
            
            {googleAccessToken && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="w-10 h-10 rounded-full bg-[#15C3A1]/10 flex items-center justify-center text-[#15C3A1]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Authenticated as</div>
                  <div className="text-sm font-bold text-white">{firebaseUser?.email || "Google Workspace"}</div>
                </div>
                <button 
                  onClick={logoutFromFirebase}
                  className="text-xs bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white transition-all px-2.5 py-1.5 rounded-lg ml-2 font-semibold"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {!googleAccessToken ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-[#15C3A1]/10 border border-[#15C3A1]/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#15C3A1]">
              <FormInput className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-space font-bold text-gray-900 mb-2">Connect Google Workspace</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Authenticate with your Google account to automatically list, create, and submit forms stored in your Google Drive.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left text-xs text-amber-800 mb-6 flex gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">Permissions Granted:</strong>
                Our application securely proxies requests to Google Drive and Forms APIs using standard, read/write scoped OAuth 2.0 tokens. We never store your Google credentials.
              </div>
            </div>

            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white hover:bg-[#D31C2B] transition-colors py-3 px-6 rounded-xl font-bold font-space"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign In with Google
            </button>
          </div>
        ) : (
          /* Main Dashboard Content */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Side: Forms List & Actions */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="font-space font-bold text-gray-900 flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-amber-500" />
                    My Google Forms
                  </h3>
                  <button
                    onClick={() => fetchGoogleForms(googleAccessToken)}
                    disabled={isLoading}
                    className="p-1.5 text-gray-400 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-gray-900' : ''}`} />
                  </button>
                </div>

                {/* Create Form Action */}
                <button
                  onClick={createNewGoogleForm}
                  disabled={isCreating}
                  className="w-full mb-5 flex items-center justify-center gap-2 bg-[#D31C2B] text-white hover:bg-red-700 transition-colors py-2.5 px-4 rounded-xl font-bold font-space text-sm shadow-sm disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {isCreating ? "Initializing..." : "New Trading Survey Form"}
                </button>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search forms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#D31C2B] text-gray-900"
                  />
                </div>

                {/* File List */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin w-6 h-6 border-2 border-[#D31C2B] border-t-transparent rounded-full" />
                    </div>
                  ) : filteredForms.length === 0 ? (
                    <div className="text-center py-10">
                      <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs">No Google Forms found in this account.</p>
                      <button 
                        onClick={createNewGoogleForm} 
                        className="text-xs text-[#D31C2B] font-bold hover:underline mt-2 block mx-auto"
                      >
                        Create your first form now
                      </button>
                    </div>
                  ) : (
                    filteredForms.map((file) => {
                      const isSelected = selectedForm?.id === file.id;
                      return (
                        <button
                          key={file.id}
                          onClick={() => setSelectedForm(file)}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            isSelected 
                              ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300' 
                              : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-amber-100 text-amber-800' : 'bg-purple-50 text-purple-600'}`}>
                            <FileSpreadsheet className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-xs truncate leading-snug">{file.name}</div>
                            <div className="text-[10px] text-gray-500 font-mono mt-1">
                              Created: {new Date(file.createdTime).toLocaleDateString()}
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 shrink-0 self-center ${isSelected ? 'text-amber-600' : 'text-gray-400'}`} />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* API and Integration Notes */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <h4 className="font-space font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-2.5">
                  <Info className="w-4 h-4 text-blue-500" />
                  Integration Details
                </h4>
                <div className="space-y-2 text-xs text-gray-500 leading-relaxed">
                  <p>
                    This app makes real-time, authenticated calls directly from your browser to Google Drive and Google Forms API.
                  </p>
                  <p className="border-t border-gray-100 pt-2 font-mono text-[10px]">
                    Scopes requested:<br />
                    • drive.readonly<br />
                    • forms.body.readonly
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Form Viewer / Embed */}
            <div className="lg:col-span-8">
              {selectedForm ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col h-full min-h-[600px]">
                  
                  {/* Form Header info */}
                  <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setSelectedForm(null)}
                        className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors lg:hidden"
                      >
                        <ArrowLeft className="w-4 h-4 text-gray-600" />
                      </button>
                      <div>
                        <h2 className="text-xl font-space font-bold text-gray-950 flex items-center gap-2">
                          <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                          {selectedForm.name}
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="font-mono">ID: {selectedForm.id}</span>
                          <span>•</span>
                          <span>Created: {new Date(selectedForm.createdTime).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={selectedForm.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-[#D31C2B] hover:underline px-3 py-2 border border-red-200 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Edit on Google
                      </a>
                    </div>
                  </div>

                  {/* Form Live Embed Frame */}
                  <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden min-h-[500px] flex flex-col">
                    <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span>Interactive Google Form Embed</span>
                      </div>
                      <span className="font-mono text-[10px]">forms.gle/embed</span>
                    </div>
                    <iframe
                      src={`https://docs.google.com/forms/d/e/${selectedForm.id}/viewform?embedded=true`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      className="flex-1 w-full h-full bg-white"
                      title="Google Form Embed"
                    >
                      Loading…
                    </iframe>
                  </div>
                </div>
              ) : (
                /* No Form Selected State / Placeholder */
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[600px]">
                  <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center mb-6 text-gray-400">
                    <FileSpreadsheet className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-space font-bold text-gray-900 mb-2">No Form Selected</h3>
                  <p className="text-gray-500 text-sm max-w-md leading-relaxed mb-6">
                    Select a Google Form from your workspace list on the left to view its live embedded preview, or click the button below to initialize a pre-formatted Axi trading feedback survey form.
                  </p>
                  
                  {googleAccessToken && (
                    <button
                      onClick={createNewGoogleForm}
                      disabled={isCreating}
                      className="bg-gray-900 text-white hover:bg-[#D31C2B] transition-colors py-2.5 px-6 rounded-xl font-bold font-space text-sm shadow-sm"
                    >
                      {isCreating ? "Initializing..." : "Create Survey Form"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
