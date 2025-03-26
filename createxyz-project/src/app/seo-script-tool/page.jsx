"use client";
import React from "react";

import { useHandleStreamResponse } from "../utilities/runtime-helpers";

function MainComponent() {
  const [originalScript, setOriginalScript] = useState("");
  const [result, setResult] = useState("");
  const [customRequest, setCustomRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [error, setError] = useState("");
  const [seoData, setSeoData] = useState(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [language, setLanguage] = useState("vi");
  const [currentStyle, setCurrentStyle] = useState("");
  const [rewrittenScript, setRewrittenScript] = useState("");
  const [processingStep, setProcessingStep] = useState("");
  const [activeLanguageTab, setActiveLanguageTab] = useState("vi");
  const processWithAI = async (text, type) => {
    if (!text.trim()) {
      throw new Error("Vui lòng nhập nội dung trước khi xử lý");
    }

    let prompt = "";
    const styleDescriptions = {
      survival: {
        en: "dramatic survival battles",
        vi: "kịch tính sinh tồn",
      },
      natgeo: {
        en: "National Geographic style",
        vi: "phong cách National Geographic",
      },
      explore: {
        en: "wildlife exploration",
        vi: "thám hiểm hoang dã",
      },
      hunting: {
        en: "dramatic hunting scenes",
        vi: "săn mồi kịch tính",
      },
      mystery: {
        en: "mysterious wildlife behavior",
        vi: "bí ẩn thiên nhiên",
      },
      territory: {
        en: "territorial conflicts",
        vi: "cuộc chiến lãnh thổ",
      },
    };

    const styleDescription = currentStyle
      ? styleDescriptions[currentStyle][language === "en" ? "en" : "vi"]
      : "";

    switch (type) {
      case "rewrite":
        if (!currentStyle) {
          throw new Error(
            "Vui lòng chọn phong cách viết trước khi viết lại kịch bản"
          );
        }
        if (language === "both") {
          prompt = `Với tư cách là một biên kịch phim tài liệu động vật chuyên nghiệp, hãy viết lại kịch bản sau theo phong cách ${styleDescription}. Tạo một câu chuyện hoàn chỉnh, chi tiết và hấp dẫn, sẵn sàng để sản xuất.

Yêu cầu:
- Viết song ngữ Anh-Việt, với mỗi câu/đoạn được viết liên tiếp bằng cả hai ngôn ngữ
- Ví dụ format:
  [Câu tiếng Việt]
  [Same sentence in English]
  
  [Đoạn văn tiếng Việt]
  [Same paragraph in English]
- Giữ nguyên ý chính nhưng làm cho nó kịch tính và hấp dẫn hơn
- Thêm mô tả sinh động về môi trường và hành vi động vật
- Bao gồm chi tiết cụ thể về chuyển động và hành động của động vật
- Tạo căng thẳng và sự đầu tư cảm xúc
- Sử dụng phong cách tường thuật tài liệu chuyên nghiệp
- Viết sẵn sàng để sản xuất, không có phần giữ chỗ hoặc gợi ý
- Viết thành các đoạn văn hoàn chỉnh, có cấu trúc tốt
- Đảm bảo bản dịch tiếng Anh tự nhiên và phù hợp với khán giả quốc tế

Kịch bản cần viết lại:\n${text}`;
        } else if (language === "en") {
          prompt = `As a professional wildlife documentary scriptwriter, rewrite the following script in English with ${styleDescription} style. Create a complete, detailed and engaging narrative that's ready for production. Focus on dramatic wildlife battles and survival. The script should be professional and suitable for mainstream audiences (especially American).

Requirements:
- Maintain the main ideas but make them more dramatic and engaging
- Add vivid descriptions of the environment and animal behaviors
- Include specific details about the animals' movements and actions
- Create tension and emotional investment
- Use professional documentary narrative style
- Make it production-ready with no placeholders or suggestions
- Write in complete, well-structured paragraphs

Script to rewrite:\n${text}`;
        } else if (language === "vi") {
          prompt = `Với tư cách là một biên kịch phim tài liệu động vật chuyên nghiệp, hãy viết lại kịch bản sau bằng tiếng Việt theo phong cách ${styleDescription}. Tạo một câu chuyện hoàn chỉnh, chi tiết và hấp dẫn, sẵn sàng để sản xuất. Tập trung vào cuộc chiến sinh tồn của động vật hoang dã.

Yêu cầu:
- Giữ nguyên ý chính nhưng làm cho nó kịch tính và hấp dẫn hơn
- Thêm mô tả sinh động về môi trường và hành vi động vật
- Bao gồm chi tiết cụ thể về chuyển động và hành động của động vật
- Tạo căng thẳng và sự đầu tư cảm xúc
- Sử dụng phong cách tường thuật tài liệu chuyên nghiệp
- Viết sẵn sàng để sản xuất, không có phần giữ chỗ hoặc gợi ý
- Viết thành các đoạn văn hoàn chỉnh, có cấu trúc tốt

Kịch bản cần viết lại:\n${text}`;
        }
        break;
      case "seo":
        prompt = `Phân tích và tạo gói SEO đầy đủ cho nội dung sau theo phong cách ${styleDescription}, bao gồm:
1. Tiêu đề hấp dẫn (${
          language === "both"
            ? "tiếng Anh và tiếng Việt"
            : language === "en"
            ? "tiếng Anh"
            : "tiếng Việt"
        })
2. Mô tả ngắn gọn (${
          language === "both"
            ? "tiếng Anh và tiếng Việt"
            : language === "en"
            ? "tiếng Anh"
            : "tiếng Việt"
        })
3. Từ khóa dài ngách liên quan (cách nhau bởi dấu phẩy)
4. Hashtags ngách phù hợp (cách nhau bởi dấu phẩy)
5. Call-to-action cho pin comment
Tối ưu cho YouTube và hướng đến khán giả đại chúng (đặc biệt là Mỹ)

Nội dung:\n${text}`;
        break;
      case "prompt":
        prompt = `Tạo các prompt chi tiết theo phong cách ${styleDescription} để:
1. Tạo thumbnail hấp dẫn cho video
2. Tạo các hình ảnh minh họa cho các phần chính của video
Dựa trên nội dung sau:\n${text}`;
        break;
      case "shorter":
        prompt = `Tóm tắt ngắn gọn nội dung sau, giữ lại các ý chính quan trọng nhất:\n${text}`;
        break;
      case "longer":
        prompt = `Mở rộng và bổ sung chi tiết cho nội dung sau, làm cho nó phong phú và hấp dẫn hơn:\n${text}`;
        break;
      case "keywords":
        prompt = `Phân tích và đề xuất thêm từ khóa SEO liên quan cho nội dung:\n${text}`;
        break;
      case "sound":
        prompt = `Đề xuất âm thanh môi trường và hiệu ứng âm thanh phù hợp cho nội dung sau:\n${text}`;
        break;
      case "behavior":
        prompt = `Bổ sung thông tin chi tiết về hành vi động vật được đề cập trong nội dung sau:\n${text}`;
        break;
      case "science":
        prompt = `Bổ sung dữ liệu khoa học và thông tin nghiên cứu liên quan đến nội dung sau:\n${text}`;
        break;
      default:
        throw new Error("Loại xử lý không hợp lệ");
    }

    const response = await fetch("/integrations/anthropic-claude-sonnet-3-5/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Lỗi khi xử lý với AI: [${response.status}] ${response.statusText}`
      );
    }

    return response;
  };
  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreamingMessage,
    onFinish: (message) => {
      setStreamingMessage("");
      if (message) {
        setResult(message);
        if (processingStep === "rewrite") {
          setRewrittenScript(message);
        }
      }
    },
  });

  const handleProcessing = async (type) => {
    setLoading(true);
    setError("");
    setResult("");
    setProcessingStep(type);

    try {
      if (type === "seo" || type === "prompt") {
        if (!rewrittenScript) {
          throw new Error(
            "Vui lòng viết lại kịch bản trước khi tối ưu SEO hoặc tạo prompt hình ảnh"
          );
        }
        const response = await processWithAI(rewrittenScript, type);
        handleStreamResponse(response);
      } else {
        const response = await processWithAI(originalScript, type);
        handleStreamResponse(response);
      }
    } catch (err) {
      console.error("Error processing with AI:", err);
      setError(
        err.message || "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };
  const handleStyleSelection = async (style) => {
    setCurrentStyle(style);
    setProcessingStep("rewrite");
    await handleProcessing("rewrite");
  };
  const handleAdjustment = async (type) => {
    if (!result) {
      setError("Vui lòng xử lý nội dung trước khi điều chỉnh");
      return;
    }
    await handleProcessing(type);
  };
  const handleCustomRequest = async () => {
    if (!customRequest.trim()) {
      setError("Vui lòng nhập yêu cầu tùy chỉnh");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch(
        "/integrations/anthropic-claude-sonnet-3-5/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `${customRequest}\n\nDựa trên nội dung sau:\n${originalScript}`,
              },
            ],
            stream: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Lỗi khi xử lý với AI: [${response.status}] ${response.statusText}`
        );
      }

      handleStreamResponse(response);
    } catch (err) {
      console.error("Error processing custom request:", err);
      setError(
        err.message || "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 font-inter">
          Công cụ hỗ trợ xử lý kịch bản và SEO
        </h1>

        <div className="space-y-6">
          <div>
            <textarea
              className="w-full h-48 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-inter"
              placeholder="Nhập kịch bản gốc của bạn tại đây..."
              value={originalScript}
              onChange={(e) => setOriginalScript(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="vi"
                  name="language"
                  value="vi"
                  checked={language === "vi"}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-gray-900"
                />
                <label htmlFor="vi" className="flex items-center gap-1">
                  <i className="fas fa-flag text-red-500"></i>
                  Tiếng Việt
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="en"
                  name="language"
                  value="en"
                  checked={language === "en"}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-gray-900"
                />
                <label htmlFor="en" className="flex items-center gap-1">
                  <i className="fas fa-flag text-blue-500"></i>
                  Tiếng Anh
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="both"
                  name="language"
                  value="both"
                  checked={language === "both"}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="text-gray-900"
                />
                <label htmlFor="both" className="flex items-center gap-1">
                  <i className="fas fa-language text-purple-500"></i>
                  Song ngữ
                </label>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => handleProcessing("rewrite")}
                disabled={!currentStyle}
                className={`${
                  !currentStyle ? "opacity-50 cursor-not-allowed" : ""
                } bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-inter transition-colors`}
              >
                1. Viết lại kịch bản
              </button>
              <button
                onClick={() => handleProcessing("seo")}
                disabled={!rewrittenScript}
                className={`${
                  !rewrittenScript ? "opacity-50 cursor-not-allowed" : ""
                } bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-inter transition-colors`}
              >
                2. Tối ưu SEO
              </button>
              <button
                onClick={() => handleProcessing("prompt")}
                disabled={!rewrittenScript}
                className={`${
                  !rewrittenScript ? "opacity-50 cursor-not-allowed" : ""
                } bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-inter transition-colors`}
              >
                3. Tạo prompt hình ảnh
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Phong cách viết
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleStyleSelection("survival")}
                className={`flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors ${
                  currentStyle === "survival" ? "bg-gray-900 text-white" : ""
                }`}
                title="Tập trung vào cuộc chiến sinh tồn gay cấn"
              >
                <i className="fas fa-skull"></i>
                Kịch tính sinh tồn
              </button>
              <button
                onClick={() => handleStyleSelection("natgeo")}
                className={`flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors ${
                  currentStyle === "natgeo" ? "bg-gray-900 text-white" : ""
                }`}
                title="Phong cách tài liệu chuyên nghiệp"
              >
                <i className="fas fa-globe-americas"></i>
                National Geographic
              </button>
              <button
                onClick={() => handleStyleSelection("explore")}
                className={`flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors ${
                  currentStyle === "explore" ? "bg-gray-900 text-white" : ""
                }`}
                title="Phong cách phiêu lưu, khám phá"
              >
                <i className="fas fa-compass"></i>
                Thám hiểm hoang dã
              </button>
              <button
                onClick={() => handleStyleSelection("hunting")}
                className={`flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors ${
                  currentStyle === "hunting" ? "bg-gray-900 text-white" : ""
                }`}
                title="Tập trung vào những pha săn mồi gay cấn"
              >
                <i className="fas fa-paw"></i>
                Săn mồi kịch tính
              </button>
              <button
                onClick={() => handleStyleSelection("mystery")}
                className={`flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors ${
                  currentStyle === "mystery" ? "bg-gray-900 text-white" : ""
                }`}
                title="Khám phá những hành vi bí ẩn của động vật"
              >
                <i className="fas fa-question-circle"></i>
                Bí ẩn thiên nhiên
              </button>
              <button
                onClick={() => handleStyleSelection("territory")}
                className={`flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors ${
                  currentStyle === "territory" ? "bg-gray-900 text-white" : ""
                }`}
                title="Tập trung vào xung đột lãnh thổ giữa các loài"
              >
                <i className="fas fa-map-marked-alt"></i>
                Cuộc chiến lãnh thổ
              </button>
            </div>
          </div>

          {loading && (
            <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          )}

          {error && (
            <div className="text-red-500 dark:text-red-400 font-inter text-sm p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {error}
            </div>
          )}

          {!loading && (result || streamingMessage) && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                {language === "both" && (
                  <>
                    <button
                      onClick={() => setActiveLanguageTab("vi")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        activeLanguageTab === "vi"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <i className="fas fa-flag text-red-500"></i>
                      Tiếng Việt
                    </button>
                    <button
                      onClick={() => setActiveLanguageTab("en")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        activeLanguageTab === "en"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <i className="fas fa-flag text-blue-500"></i>
                      English
                    </button>
                  </>
                )}
              </div>
              <div className="relative">
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <i
                    className={`fas fa-flag ${
                      language === "en" ? "text-blue-500" : "text-red-500"
                    }`}
                  ></i>
                  <span className="text-sm text-gray-500">
                    {language === "en" ? "English" : "Tiếng Việt"}
                  </span>
                </div>
                <textarea
                  className="w-full h-48 p-4 pt-8 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-inter"
                  value={streamingMessage || result}
                  readOnly
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                  }}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Copy to clipboard"
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>

              {showComparison && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Bản gốc:
                    </h3>
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      {originalScript}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Bản mới:
                    </h3>
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      {result}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAdjustment("sound")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors"
              >
                <i className="fas fa-volume-up"></i>
                Thêm âm thanh môi trường
              </button>
              <button
                onClick={() => handleAdjustment("behavior")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors"
              >
                <i className="fas fa-paw"></i>
                Thêm chi tiết hành vi
              </button>
              <button
                onClick={() => handleAdjustment("science")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors"
              >
                <i className="fas fa-microscope"></i>
                Thêm thông tin khoa học
              </button>
              <button
                onClick={() => handleAdjustment("shorter")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors"
              >
                <i className="fas fa-compress-alt"></i>
                Ngắn gọn hơn
              </button>
              <button
                onClick={() => handleAdjustment("longer")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors"
              >
                <i className="fas fa-expand-alt"></i>
                Chi tiết hơn
              </button>
              <button
                onClick={() => handleAdjustment("keywords")}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors"
              >
                <i className="fas fa-tags"></i>
                Thêm từ khóa
              </button>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-inter"
                placeholder="Nhập yêu cầu tùy chỉnh..."
                value={customRequest}
                onChange={(e) => setCustomRequest(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCustomRequest();
                  }
                }}
              />
              <button
                onClick={handleCustomRequest}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 font-inter transition-colors"
                disabled={loading}
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Gửi yêu cầu
              </button>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 font-inter transition-colors"
              >
                <i className="fas fa-columns mr-2"></i>
                So sánh với bản gốc
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;