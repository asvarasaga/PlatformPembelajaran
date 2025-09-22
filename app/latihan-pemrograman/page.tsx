"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, Play, RotateCcw, Copy, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const ESP32_PROJECTS = [
  {
    id: "led-control",
    title: "Kontrol LED Sederhana",
    description: "Belajar mengontrol LED melalui web server ESP32",
    difficulty: "Pemula",
    link: "https://wokwi.com/projects/366518518081930370",
    code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);
const int ledPin = 2;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  server.on("/", handleRoot);
  server.on("/led/on", handleLedOn);
  server.on("/led/off", handleLedOff);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}

void handleRoot() {
  String html = "<html><body>";
  html += "<h1>ESP32 LED Control</h1>";
  html += "<p><a href='/led/on'>Turn LED ON</a></p>";
  html += "<p><a href='/led/off'>Turn LED OFF</a></p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleLedOn() {
  digitalWrite(ledPin, HIGH);
  server.send(200, "text/plain", "LED is ON");
}

void handleLedOff() {
  digitalWrite(ledPin, LOW);
  server.send(200, "text/plain", "LED is OFF");
}`,
  },
  {
    id: "multiple-led-control",
    title: "Kontrol Multiple LED",
    description: "Mengontrol 3 LED dengan pattern berbeda melalui web server",
    difficulty: "Menengah",
    link: "https://wokwi.com/projects/366518518081930370",
    code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);
const int ledPin1 = 2;
const int ledPin2 = 4;
const int ledPin3 = 5;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin1, OUTPUT);
  pinMode(ledPin2, OUTPUT);
  pinMode(ledPin3, OUTPUT);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  server.on("/", handleRoot);
  server.on("/led/all-on", handleAllOn);
  server.on("/led/all-off", handleAllOff);
  server.on("/led/pattern1", handlePattern1);
  server.on("/led/pattern2", handlePattern2);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
}

void handleRoot() {
  String html = "<html><body>";
  html += "<h1>ESP32 Multiple LED Control</h1>";
  html += "<p><a href='/led/all-on'>All LEDs ON</a></p>";
  html += "<p><a href='/led/all-off'>All LEDs OFF</a></p>";
  html += "<p><a href='/led/pattern1'>Pattern 1 (Sequential)</a></p>";
  html += "<p><a href='/led/pattern2'>Pattern 2 (Blinking)</a></p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleAllOn() {
  digitalWrite(ledPin1, HIGH);
  digitalWrite(ledPin2, HIGH);
  digitalWrite(ledPin3, HIGH);
  server.send(200, "text/plain", "All LEDs are ON");
}

void handleAllOff() {
  digitalWrite(ledPin1, LOW);
  digitalWrite(ledPin2, LOW);
  digitalWrite(ledPin3, LOW);
  server.send(200, "text/plain", "All LEDs are OFF");
}

void handlePattern1() {
  for(int i = 0; i < 3; i++) {
    digitalWrite(ledPin1, HIGH);
    delay(200);
    digitalWrite(ledPin1, LOW);
    digitalWrite(ledPin2, HIGH);
    delay(200);
    digitalWrite(ledPin2, LOW);
    digitalWrite(ledPin3, HIGH);
    delay(200);
    digitalWrite(ledPin3, LOW);
  }
  server.send(200, "text/plain", "Pattern 1 executed");
}

void handlePattern2() {
  for(int i = 0; i < 5; i++) {
    digitalWrite(ledPin1, HIGH);
    digitalWrite(ledPin2, HIGH);
    digitalWrite(ledPin3, HIGH);
    delay(300);
    digitalWrite(ledPin1, LOW);
    digitalWrite(ledPin2, LOW);
    digitalWrite(ledPin3, LOW);
    delay(300);
  }
  server.send(200, "text/plain", "Pattern 2 executed");
}`,
  },
  {
    id: "led-button-control",
    title: "LED dengan Sensor Button",
    description: "Kontrol LED menggunakan button fisik dan web server",
    difficulty: "Menengah",
    link: "https://wokwi.com/projects/366518518081930370",
    code: `#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);
const int ledPin = 2;
const int buttonPin = 18;

bool ledState = false;
bool lastButtonState = false;
bool currentButtonState = false;
unsigned long lastDebounceTime = 0;
unsigned long debounceDelay = 50;

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  server.on("/", handleRoot);
  server.on("/led/toggle", handleToggle);
  server.on("/led/status", handleStatus);
  
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  
  // Read button with debouncing
  int reading = digitalRead(buttonPin);
  
  if (reading != lastButtonState) {
    lastDebounceTime = millis();
  }
  
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != currentButtonState) {
      currentButtonState = reading;
      
      if (currentButtonState == LOW) {
        ledState = !ledState;
        digitalWrite(ledPin, ledState);
        Serial.println(ledState ? "LED ON (Button)" : "LED OFF (Button)");
      }
    }
  }
  
  lastButtonState = reading;
}

void handleRoot() {
  String html = "<html><body>";
  html += "<h1>ESP32 LED + Button Control</h1>";
  html += "<p>LED Status: " + String(ledState ? "ON" : "OFF") + "</p>";
  html += "<p><a href='/led/toggle'>Toggle LED</a></p>";
  html += "<p><a href='/led/status'>Check Status</a></p>";
  html += "<p>Tekan button fisik pada pin 18 untuk toggle LED</p>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleToggle() {
  ledState = !ledState;
  digitalWrite(ledPin, ledState);
  server.send(200, "text/plain", ledState ? "LED is ON" : "LED is OFF");
}

void handleStatus() {
  String status = "LED Status: " + String(ledState ? "ON" : "OFF");
  server.send(200, "text/plain", status);
}`,
  },
  {
    id: "lcd-i2c-display",
    title: "LCD I2C 16x2 Display",
    description: "Menampilkan teks pada LCD I2C 16x2 melalui web server",
    difficulty: "Lanjutan",
    link: "https://wokwi.com/projects/366518518081930370",
    code: `#include <WiFi.h>
#include <WebServer.h>
#include <LiquidCrystal_I2C.h>
#include <Wire.h>

const char* ssid = "Rey";
const char* password = "rey123456789";

WebServer server(80);

#define SDA_PIN 21
#define SCL_PIN 22

// Try common I2C addresses (0x27 or 0x3F)
LiquidCrystal_I2C lcd(0x27, 16, 2);
bool lcdFound = false;

String currentLine1 = "SMK N 3 YK";
String currentLine2 = "ESP32 Ready!";

void setup() {
  Serial.begin(115200);
  
  Wire.begin(SDA_PIN, SCL_PIN);
  
  Serial.println("Scanning for I2C devices...");
  byte address = scanI2C();
  
  if (address != 0) {
    lcd = LiquidCrystal_I2C(address, 16, 2);
    lcdFound = true;
    Serial.print("LCD found at address: 0x");
    Serial.println(address, HEX);
  } else {
    Serial.println("No I2C device found! Check wiring:");
    Serial.println("SDA -> GPIO 21");
    Serial.println("SCL -> GPIO 22");
    Serial.println("VCC -> 3.3V (NOT 5V!)");
    Serial.println("GND -> GND");
  }
  
  if (lcdFound) {
    // Initialize LCD
    lcd.init();
    lcd.backlight();
    lcd.setCursor(0, 0);
    lcd.print(currentLine1);
    lcd.setCursor(0, 1);
    lcd.print(currentLine2);
  }
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
    if (lcdFound) {
      lcd.setCursor(0, 1);
      lcd.print("Connecting WiFi.");
    }
  }
  
  Serial.println("WiFi connected!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  if (lcdFound) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("WiFi Connected!");
    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());
  }
  
  server.on("/", handleRoot);
  server.on("/lcd/clear", handleClear);
  server.on("/lcd/time", handleTime);
  server.on("/lcd/custom", handleCustom);
  server.on("/lcd/scroll", handleScroll);
  server.on("/lcd/scan", handleScan);
  
  server.begin();
  Serial.println("HTTP server started");
}

byte scanI2C() {
  byte error, address;
  int nDevices = 0;
  
  for(address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("I2C device found at address 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
      nDevices++;
      
      // Return first found address (usually LCD)
      if (address == 0x27 || address == 0x3F) {
        return address;
      }
    }
  }
  
  if (nDevices == 0) {
    Serial.println("No I2C devices found");
    return 0;
  }
  
  return 0;
}

void loop() {
  server.handleClient();
}

void handleRoot() {
  String html = "<html><body>";
  html += "<h1>ESP32 LCD I2C Control</h1>";
  
  if (!lcdFound) {
    html += "<p style='color:red;'><strong>LCD TIDAK DITEMUKAN!</strong></p>";
    html += "<p>Periksa koneksi:</p>";
    html += "<ul>";
    html += "<li>SDA -> GPIO 21</li>";
    html += "<li>SCL -> GPIO 22</li>";
    html += "<li>VCC -> 3.3V (BUKAN 5V!)</li>";
    html += "<li>GND -> GND</li>";
    html += "</ul>";
    html += "<p><a href='/lcd/scan'>Scan I2C Devices</a></p>";
  } else {
    html += "<p>Current Display:</p>";
    html += "<p>Line 1: " + currentLine1 + "</p>";
    html += "<p>Line 2: " + currentLine2 + "</p>";
    html += "<hr>";
    html += "<p><a href='/lcd/clear'>Clear LCD</a></p>";
    html += "<p><a href='/lcd/time'>Show Time Counter</a></p>";
    html += "<p><a href='/lcd/custom?line1=Hello&line2=World'>Custom Text (Hello/World)</a></p>";
    html += "<p><a href='/lcd/scroll'>Scrolling Text Demo</a></p>";
    html += "<p><a href='/lcd/scan'>Scan I2C Devices</a></p>";
    html += "<hr>";
    html += "<form action='/lcd/custom' method='GET'>";
    html += "Line 1: <input type='text' name='line1' maxlength='16'><br><br>";
    html += "Line 2: <input type='text' name='line2' maxlength='16'><br><br>";
    html += "<input type='submit' value='Update LCD'>";
    html += "</form>";
  }
  
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleScan() {
  String result = "I2C Scanner Results:";
  byte error, address;
  int nDevices = 0;
  
  for(address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      result += "Device found at 0x";
      if (address < 16) result += "0";
      result += String(address, HEX) + "";
      nDevices++;
    }
  }
  
  if (nDevices == 0) {
    result += "No I2C devices found!";
    result += "Check your wiring:";
    result += "SDA -> GPIO 21";
    result += "SCL -> GPIO 22";
    result += "VCC -> 3.3V (NOT 5V!)";
    result += "GND -> GND";
  }
  
  server.send(200, "text/plain", result);
}

void handleClear() {
  if (!lcdFound) {
    server.send(400, "text/plain", "LCD not found!");
    return;
  }
  
  lcd.clear();
  currentLine1 = "";
  currentLine2 = "";
  server.send(200, "text/plain", "LCD Cleared");
}

void handleTime() {
  if (!lcdFound) {
    server.send(400, "text/plain", "LCD not found!");
    return;
  }
  
  unsigned long seconds = millis() / 1000;
  unsigned long minutes = seconds / 60;
  unsigned long hours = minutes / 60;
  
  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Uptime:");
  lcd.setCursor(0, 1);
  
  String timeStr = "";
  if (hours < 10) timeStr += "0";
  timeStr += String(hours) + ":";
  if (minutes < 10) timeStr += "0";
  timeStr += String(minutes) + ":";
  if (seconds < 10) timeStr += "0";
  timeStr += String(seconds);
  
  lcd.print(timeStr);
  
  currentLine1 = "Uptime:";
  currentLine2 = timeStr;
  
  server.send(200, "text/plain", "Time displayed: " + timeStr);
}

void handleCustom() {
  if (!lcdFound) {
    server.send(400, "text/plain", "LCD not found!");
    return;
  }
  
  String line1 = server.arg("line1");
  String line2 = server.arg("line2");
  
  if (line1.length() == 0 && line2.length() == 0) {
    server.send(400, "text/plain", "Please provide line1 or line2 parameter");
    return;
  }
  
  lcd.clear();
  
  if (line1.length() > 0) {
    lcd.setCursor(0, 0);
    lcd.print(line1.substring(0, 16));
    currentLine1 = line1.substring(0, 16);
  }
  
  if (line2.length() > 0) {
    lcd.setCursor(0, 1);
    lcd.print(line2.substring(0, 16));
    currentLine2 = line2.substring(0, 16);
  }
  
  server.send(200, "text/plain", "LCD Updated - Line1: " + currentLine1 + ", Line2: " + currentLine2);
}

void handleScroll() {
  if (!lcdFound) {
    server.send(400, "text/plain", "LCD not found!");
    return;
  }
  
  String longText = "SMK Negeri 3 Yogyakarta - Teknik Elektronika Kelas 11 - ESP32 Learning Platform";
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Scrolling Demo:");
  
  for (int i = 0; i <= longText.length() - 16; i++) {
    lcd.setCursor(0, 1);
    lcd.print(longText.substring(i, i + 16));
    delay(300);
  }
  
  currentLine1 = "Scrolling Demo:";
  currentLine2 = longText.substring(longText.length() - 16);
  
  server.send(200, "text/plain", "Scrolling demo completed");
}`,
  },
]

export default function ESP32LearningPlatform() {
  const [currentProject, setCurrentProject] = useState(ESP32_PROJECTS[0])
  const [userCode, setUserCode] = useState("")
  const [currentLine, setCurrentLine] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showShadow, setShowShadow] = useState(true)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const shadowRef = useRef<HTMLPreElement>(null)

  const codeLines = currentProject.code.split("\n")
  const expectedCode = codeLines.join("\n")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "C") {
        e.preventDefault()
        completeCode()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [expectedCode])

  const completeCode = () => {
    setUserCode(expectedCode)
    setIsCompleted(true)
    setCurrentLine(codeLines.length)
    setCursorPosition(expectedCode.length)

    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(expectedCode.length, expectedCode.length)
    }
  }

  useEffect(() => {
    const lines = userCode.split("\n")
    let completedLines = 0

    for (let i = 0; i < Math.min(lines.length, codeLines.length); i++) {
      if (lines[i] === codeLines[i]) {
        completedLines = i + 1
      } else {
        break
      }
    }

    setCurrentLine(completedLines)
    setIsCompleted(userCode.trim() === expectedCode.trim())
  }, [userCode, expectedCode, codeLines])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const newCursorPos = e.target.selectionStart || 0

    if (newValue.length > userCode.length) {
      const addedChar = newValue[userCode.length]
      const expectedChar = expectedCode[userCode.length]

      if (addedChar === expectedChar) {
        setUserCode(newValue)
        setCursorPosition(newCursorPos)
      } else {
        e.target.value = userCode
        e.target.setSelectionRange(userCode.length, userCode.length)
      }
    } else if (newValue.length < userCode.length) {
      setUserCode(newValue)
      setCursorPosition(newCursorPos)
    } else {
      let isValid = true
      for (let i = 0; i < newValue.length; i++) {
        if (newValue[i] !== expectedCode[i]) {
          isValid = false
          break
        }
      }

      if (isValid) {
        setUserCode(newValue)
        setCursorPosition(newCursorPos)
      } else {
        e.target.value = userCode
        e.target.setSelectionRange(cursorPosition, cursorPosition)
      }
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    setScrollTop(scrollTop)
    if (shadowRef.current) {
      shadowRef.current.scrollTop = scrollTop
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    const currentPos = textarea.selectionStart || 0

    if (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x" || e.key === "a")) {
      e.preventDefault()
      return
    }

    if (e.key === "ArrowRight" && currentPos >= userCode.length) {
      e.preventDefault()
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
      setTimeout(() => {
        const newPos = textarea.selectionStart || 0
        if (newPos > userCode.length) {
          textarea.setSelectionRange(userCode.length, userCode.length)
        }
      }, 0)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const resetCode = () => {
    setUserCode("")
    setCurrentLine(0)
    setIsCompleted(false)
    setCursorPosition(0)
  }

  const runSimulation = () => {
    if (isCompleted) {
      alert("Kode berhasil! Siap untuk diupload ke ESP32.")
    } else {
      alert("Kode belum lengkap. Pastikan semua baris sesuai dengan shadow text.")
    }
  }

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(userCode).then(() => {
      alert("Kode berhasil disalin ke clipboard!")
    })
  }

  const downloadCode = () => {
    const element = document.createElement("a")
    const file = new Blob([userCode], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${currentProject.id}.ino`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-warna3 text-foreground">
            <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-warna5">
              <CardHeader>
                <CardTitle className="text-foreground">Pilih Project</CardTitle>
                <CardDescription className="text-muted-foreground">Pilih project ESP32 untuk dipelajari</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ESP32_PROJECTS.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors group ${
                      currentProject.id === project.id ? "bg-warna4" : "hover:bg-warna4 bg-warna3"
                    }`}
                    onClick={() => {
                      setCurrentProject(project)
                      resetCode()
                    }}
                  >
                    <h3 className="p-4 rounded-md font-semibold">
                      {project.title.split("|").map((part, i) => {
                        // warna default per bagian (saat tidak aktif)
                        const colors = [
                          "text-foreground group-hover:text-background"]

                        let base = "cursor-pointer transition-colors duration-300 "

                        if (currentProject.id === project.id) {
                          // kalau card ini aktif
                          if (i === 0) {
                            base += "text-background font-bold"
                          } else {
                            base += "text-warna2"
                          }
                        } else {
                          // kalau card ini tidak aktif → pakai warna sesuai index
                          base += colors[i] || "text-foreground group-hover:text-background"
                        }

                        return (
                          <span key={i} className={base}>
                            {part.trim()}{" "}
                          </span>
                        )
                      })}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {project.title.split("|").map((part, i) => {
                        // warna default per bagian (saat tidak aktif)
                        const colors = [
                          "text-foreground group-hover:text-background"]

                        let base = "cursor-pointer transition-colors duration-300 "

                        if (currentProject.id === project.id) {
                          // kalau card ini aktif
                          if (i === 0) {
                            base += "text-background "
                          } else {
                            base += "text-warna2 "
                          }
                        } else {
                          // kalau card ini tidak aktif → pakai warna sesuai index
                          base += colors[i] || "text-foreground group-hover:text-background"
                        }

                        return (
                          <span key={i} className={base}>
                            {part.trim()}{" "}
                          </span>
                        )
                      })}</p>
                    <Badge variant="outline" className="mt-2 text-xs bg-warna1">
                      {project.difficulty}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-warna5">
              <CardHeader>
                <div className="flex items-center justify-between ">
                  <div>
                    <CardTitle>{currentProject.title}</CardTitle>
                    <CardDescription>{currentProject.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Selesai
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 mr-1" />
                          {currentLine}/{codeLines.length} baris
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-30">
                  <div className="relative bg-muted/20 rounded-md border border-border">
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                      <pre
                        ref={shadowRef}
                        className="font-mono text-sm p-4 text-muted-foreground/40 bg-transparent whitespace-pre-wrap leading-6 overflow-auto h-96"
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          lineHeight: "1.5",
                          fontFamily:
                            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {showShadow ? currentProject.code : ""}
                      </pre>
                    </div>

                    <textarea
                      ref={textareaRef}
                      value={userCode}
                      onChange={handleCodeChange}
                      onKeyDown={handleKeyDown}
                      onContextMenu={handleContextMenu}
                      onScroll={handleScroll}
                      className="w-full min-h-94 p-4 font-mono text-sm bg-transparent border-0 resize-none relative z-20 text-foreground leading-6 outline-none"
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.5",
                        fontFamily:
                          'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                      }}
                      placeholder=""
                      spellCheck={false}
                    />

                    <div className="absolute bottom-2 right-2 z-30 bg-transparent">
                      <Badge variant="secondary" className="text-xs">
                        {userCode.length}/{expectedCode.length} karakter
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2 ">
                      <Button className="bg-warna1 text-primary-foreground" variant="outline" size="sm" onClick={() => setShowShadow(!showShadow)}>
                        {showShadow ? "Sembunyikan" : "Tampilkan"} Shadow Text
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetCode}>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <>
                          <Button variant="outline" size="sm" onClick={copyCodeToClipboard}>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy Kode
                          </Button>
                          <Button variant="outline" size="sm" onClick={downloadCode}>
                            <Download className="w-4 h-4 mr-1" />
                            Download .ino
                          </Button>
                        </>
                      )}
                        {currentProject.link && (
                        <Link href={currentProject.link} target="_blank" rel="noopener noreferrer">
                          <Button
                            className="bg-warna1 text-primary-foreground hover:bg-primary/90"
                            onClick={runSimulation}
                            disabled={!isCompleted}
                          >
                        <Play className="w-4 h-4 mr-1" />
                        Jalankan Simulasi
                      </Button>
                        </Link>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      
    </div>
  )
}
