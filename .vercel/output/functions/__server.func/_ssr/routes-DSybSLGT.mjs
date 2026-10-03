import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, c as List, l as ChevronRight, n as VolumeX, o as Play, r as Volume2, s as Pause, t as X, u as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DSybSLGT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function EagleMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 200 200",
		className: cn("text-gold", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M100 18c6 10 18 22 18 22-8 4-14 12-14 12 16-6 34-2 46 10 8 8 12 20 10 32-8-10-22-16-34-14 6 8 8 20 4 30-8-6-18-8-28-6 4 14 2 30-8 42 12-4 24 2 30 12-16 2-26 14-28 28-2-14-12-26-28-28 6-10 18-16 30-12-10-12-12-28-8-42-10-2-20 0-28 6-4-10-2-22 4-30-12-2-26 4-34 14-2-12 2-24 10-32 12-12 30-16 46-10 0 0-6-8-14-12 0 0 12-12 18-22Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				opacity: "0.85",
				d: "M70 86c8 4 14 12 16 22-10-2-20 2-26 10 2-14 6-24 10-32Zm60 0c-8 4-14 12-16 22 10-2 20 2 26 10-2-14-6-24-10-32Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "78",
				cy: "78",
				r: "4.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "122",
				cy: "78",
				r: "4.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "3",
				d: "M100 122v40M88 148h24"
			})
		]
	});
}
function createScore() {
	let ctx = null;
	let master = null;
	let muted = false;
	let volume = .22;
	const nodes = [];
	const timers = [];
	function applyGain() {
		if (!master || !ctx) return;
		master.gain.setTargetAtTime(muted ? 0 : volume, ctx.currentTime, .08);
	}
	async function start() {
		if (ctx) {
			if (ctx.state === "suspended") await ctx.resume();
			applyGain();
			return;
		}
		ctx = new (window.AudioContext || window.webkitAudioContext)();
		master = ctx.createGain();
		master.gain.value = 0;
		master.connect(ctx.destination);
		const filter = ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 420;
		filter.Q.value = .7;
		filter.connect(master);
		const drone = (freq, type, gain) => {
			const osc = ctx.createOscillator();
			const g = ctx.createGain();
			osc.type = type;
			osc.frequency.value = freq;
			g.gain.value = gain;
			osc.connect(g);
			g.connect(filter);
			osc.start();
			nodes.push(osc, g);
		};
		drone(55, "sine", .38);
		drone(82.4, "triangle", .12);
		drone(110, "sine", .09);
		drone(164.8, "sine", .04);
		const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
		const data = noiseBuf.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
		const wind = ctx.createBufferSource();
		wind.buffer = noiseBuf;
		wind.loop = true;
		const windFilter = ctx.createBiquadFilter();
		windFilter.type = "bandpass";
		windFilter.frequency.value = 680;
		windFilter.Q.value = .6;
		const windGain = ctx.createGain();
		windGain.gain.value = .045;
		wind.connect(windFilter);
		windFilter.connect(windGain);
		windGain.connect(master);
		wind.start();
		nodes.push(wind, windFilter, windGain);
		const pulse = ctx.createOscillator();
		const pulseGain = ctx.createGain();
		pulse.type = "sine";
		pulse.frequency.value = 49;
		pulseGain.gain.value = 1e-4;
		pulse.connect(pulseGain);
		pulseGain.connect(filter);
		pulse.start();
		nodes.push(pulse, pulseGain);
		const beat = () => {
			if (!ctx || !pulseGain) return;
			const t = ctx.currentTime;
			pulseGain.gain.cancelScheduledValues(t);
			pulseGain.gain.setValueAtTime(1e-4, t);
			pulseGain.gain.linearRampToValueAtTime(.09, t + .04);
			pulseGain.gain.exponentialRampToValueAtTime(1e-4, t + .55);
		};
		beat();
		timers.push(window.setInterval(beat, 2100));
		const bell = () => {
			if (!ctx || !master) return;
			const osc = ctx.createOscillator();
			const g = ctx.createGain();
			osc.type = "sine";
			osc.frequency.value = 196 + Math.random() * 40;
			g.gain.value = 1e-4;
			osc.connect(g);
			g.connect(master);
			const t = ctx.currentTime;
			g.gain.setValueAtTime(1e-4, t);
			g.gain.linearRampToValueAtTime(.035, t + .02);
			g.gain.exponentialRampToValueAtTime(1e-4, t + 3.8);
			osc.start(t);
			osc.stop(t + 4);
		};
		timers.push(window.setInterval(bell, 7800));
		window.setTimeout(bell, 1400);
		applyGain();
	}
	function stop() {
		timers.forEach((id) => window.clearInterval(id));
		timers.length = 0;
		nodes.forEach((n) => {
			try {
				if ("stop" in n && typeof n.stop === "function") n.stop();
			} catch {}
			try {
				n.disconnect();
			} catch {}
		});
		nodes.length = 0;
		ctx?.close();
		ctx = null;
		master = null;
	}
	return {
		start,
		stop,
		setMuted(next) {
			muted = next;
			applyGain();
		},
		setVolume(v) {
			volume = v;
			applyGain();
		}
	};
}
var SCHOOL = "Gjimnazi Vajdin Lamaj";
var CLASS_NAME = "Klasa XI-B";
var PROJECT_TITLE = "Shqipëria Gjatë Komunizmit";
var PROJECT_YEARS = "1944 — 1991";
var slides = [
	{
		id: "pas-luftes",
		student: "Arben Krasniqi",
		studentNo: 1,
		title: "Pas Luftës: Lindja e Pushtetit të Ri",
		kicker: "Çlirimi dhe rrënjosja e diktaturës",
		years: "1944 — 1948",
		image: "/media/pallate.jpg",
		layout: "split",
		lead: "Më 29 nëntor 1944, Tiranë u shpall e çliruar. Lufta kundër pushtuesit mbaroi, por për Shqipërinë nisi një epokë tjetër: ndërtimi i një shteti njëpartiak, ku Partia do të bëhej e vetmja zëdhënëse e së vërtetës.",
		body: [
			"Lëvizja Nacionalçlirimtare, e udhëhequr nga komunistët, doli nga lufta si forca më e organizuar ushtarake dhe politike. Qeveria e re e Enver Hoxhës e paraqiti veten si vazhdim i sakrificës partizane. Në emër të çlirimit u ngritën gjyqet e para speciale, u shpronësuan tregtarët e mëdhenj dhe u likuiduan kundërshtarët politikë — nacionalistë, klerikë, pronarë tokash.",
			"Në dhjetor 1945 u mbajtën zgjedhjet për Asamblenë Kushtetuese. Fronti Demokratik, i kontrolluar nga Partia, fitoi me shumicë dërrmuese. Më 11 janar 1946 u shpall Republika Popullore e Shqipërisë. Kushtetuta e re i dha Partisë monopolin e pushtetit dhe e përjashtoi pluralizmin si «mbeturinë borgjeze».",
			"Reforma agrare e viteve 1945–1946 ia hoqi tokën bejlerëve dhe agallarëve. Për fshatarët e varfër kjo dukej si drejtësi historike. Por brenda pak vitesh, e njëjta tokë do t’u merrej përsëri — kësaj here në emër të kolektivizimit. Nga 1948, pas prishjes me Jugosllavinë, Shqipëria u kthye në një kështjellë staliniste në breg të Adriatikut."
		],
		facts: [
			{
				label: "Çlirimi i Tiranës",
				value: "29 nëntor 1944"
			},
			{
				label: "Republika Popullore",
				value: "11 janar 1946"
			},
			{
				label: "Reforma agrare",
				value: "1945 — 1946"
			},
			{
				label: "Prishja me Beogradin",
				value: "1948"
			}
		],
		quote: {
			text: "Lufta mbaroi, por shteti i ri e shndërroi fitoren në monopol të pushtetit.",
			attrib: "Kujtesë historike"
		},
		morph: "iris"
	},
	{
		id: "enver-hoxha",
		student: "Elira Hoxhaj",
		studentNo: 2,
		title: "Enver Hoxha dhe Kulti i Udhëheqësit",
		kicker: "Diktatori që sundoi dyzet vjet",
		years: "1908 — 1985",
		image: "/media/factory.jpg",
		layout: "hero",
		lead: "Enver Hoxha (Gjirokastër, 16 tetor 1908 — Tiranë, 11 prill 1985) qeverisi Shqipërinë më gjatë se çdo udhëheqës tjetër komunist i Europës. Ai e mbijetoi Stalinin, Maon dhe të gjithë bashkëkohësit e bllokut lindor.",
		body: [
			"Hoxha u formua si mësues dhe si kuadër i Partisë Komuniste, e themeluar më 8 nëntor 1941. Gjatë luftës u bë komisar politik i Ushtrisë Nacionalçlirimtare. Nga 1944 deri më 1954 qe kryeministër; më pas e mbajti pushtetin real si Sekretar i Parë i Komitetit Qendror të PPSH-së.",
			"Kulti i personalitetit e mbuloi çdo fushë: shkollën, rrugën, këngën, librin. Portreti i tij qëndronte në klasa, zyre e shtëpi. Fjalimet e tij botohëshin në vëllime të trasha dhe mësoheshin përmendësh. Kritika ndaj tij barazohej me tradhti ndaj atdheut.",
			"Nën Hoxhën, Shqipëria u shndërrua nga një vend gjysmë-feudal në një shtet të industrializuar, por me koston e një shoqërie të mbyllur, të spiunuar dhe të frikësuar. Ai prishi radhazi me Jugosllavinë, Bashkimin Sovjetik dhe Kinën, duke e shpallur veten ruajtësin e fundit të marksizëm-leninizmit «të pastër». Pas vdekjes, e diela u quajt «Dita e Enverit»."
		],
		facts: [
			{
				label: "Lindja",
				value: "16 tetor 1908, Gjirokastër"
			},
			{
				label: "Vdekja",
				value: "11 prill 1985, Tiranë"
			},
			{
				label: "Vite në pushtet",
				value: "40 vjet"
			},
			{
				label: "Roli kryesor",
				value: "Sekretar i Parë i PPSH-së"
			}
		],
		quote: {
			text: "Në asnjë vend tjetër europian udhëheqësi nuk u bë kaq gjatë i vetmi emër i lejuar i historisë.",
			attrib: "Vështrim mbi diktaturën"
		},
		morph: "burn"
	},
	{
		id: "ppsh",
		student: "Dritan Berisha",
		studentNo: 3,
		title: "Partia e Punës së Shqipërisë",
		kicker: "Monopoli i së vërtetës politike",
		years: "1941 — 1991",
		image: "/media/classroom.jpg",
		layout: "split",
		lead: "Partia Komuniste e Shqipërisë, e themeluar më 8 nëntor 1941, u riemërtua më 1948 Partia e Punës së Shqipërisë. Për gati gjysmë shekulli ajo ishte e vetmja parti e lejuar — shteti, ligji dhe ideologjia ishin një.",
		body: [
			"PPSH-ja nuk ishte thjesht një forcë elektorale. Ajo ishte skeleti i gjithë jetës publike. Në çdo fshat, fabrikë, shkollë e repart ushtarak qëndronte organizata-bazë. Byroja Politike vendoste për industri, arsim, burgje dhe diplomaci. Nomenklatura — lista e kuadrove të besuar — përcaktonte kush mund të studionte, të udhëtonte apo të bëhej drejtor.",
			"Anëtarësia në Parti ishte privilegj dhe rrezik. Kush hynte, fitonte përparësi në punë e shtëpi; kush dëbohej, rrezikonte internimin e gjithë fisit. «Biografia» — prejardhja klasore e familjes — vendoste fatin e fëmijëve në shkollë e ushtri.",
			"Kongreset e PPSH-së shpallnin linjën e re: luftë kundër titizmit, pastaj kundër revizionizmit sovjetik, pastaj kundër maoizmit. Secila kthesë prodhonte spastrim të ri. Në fund të viteve ’80, Partia ishte e rraskapitur ideologjikisht, por ende e paprekshme ligjërisht — deri në dhjetor 1990, kur studentët e detyruan shtetin të pranonte pluralizmin."
		],
		facts: [
			{
				label: "Themelimi PKSH",
				value: "8 nëntor 1941"
			},
			{
				label: "Emri PPSH",
				value: "1948"
			},
			{
				label: "Sistemi",
				value: "Njëpartiake"
			},
			{
				label: "Rënia e monopolit",
				value: "Dhjetor 1990"
			}
		],
		quote: {
			text: "Partia nuk qeveriste shtetin. Partia ishte shteti.",
			attrib: "Analizë e sistemit"
		},
		morph: "wipe"
	},
	{
		id: "sigurimi",
		student: "Anisa Leka",
		studentNo: 4,
		title: "Sigurimi i Shtetit",
		kicker: "Syri që nuk flinte kurrë",
		years: "1944 — 1991",
		image: "/media/bunker-in.jpg",
		layout: "hero",
		lead: "Drejtoria e Sigurimit të Shtetit, e ngritur në 1944 mbi modelin e NKVD-së sovjetike, u bë aparati më i fuqishëm i frikës. Ajo nuk mbronte kufijtë — ajo mbronte Partinë nga populli i vet.",
		body: [
			"Sigurimi ndërtoi një rrjet informatorësh në lagje, fabrika, shkolla dhe brenda familjeve. Një fjalë e thënë në radhë buke, një shaka për udhëheqësin, një letër e hapur nga jashtë — mjaftonin për dosje. Fëmijët nxiteshin të denonconin prindërit; bashkëshortët spiunonin njëri-tjetrin.",
			"Kodi penal i vitit 1952 parashikonte vdekjen për komplot kundër shtetit, edhe për të mitur mbi njëmbëdhjetë vjeç. Hetuesit përdornin izolimin, kërcënimin ndaj familjes dhe torturën. Sot, muzeu «Shtëpia e Gjetheve» në Tiranë — ish-selia e përgjimeve — ruan dhomat e dëgjimit, mikrofonët e fshehur dhe dosjet.",
			"Qëllimi nuk ishte vetëm të dënohej «armiku». Qëllimi ishte që çdo shqiptar të mendonte se po e dëgjonin. Kjo vetëcensurë e brendshme ishte arma më e lirë dhe më e qëndrueshme e diktaturës."
		],
		facts: [
			{
				label: "Themelimi",
				value: "1944"
			},
			{
				label: "Modeli",
				value: "NKVD / KGB / Stasi"
			},
			{
				label: "Metoda",
				value: "Përgjim, internim, hetuesi"
			},
			{
				label: "Trashëgimia",
				value: "Shtëpia e Gjetheve"
			}
		],
		quote: {
			text: "Frika më e madhe nuk ishte burgu. Ishte fqinji që dëgjonte pas murit.",
			attrib: "Dëshmi të të përndjekurve"
		},
		morph: "blade"
	},
	{
		id: "burgjet",
		student: "Ermal Gjoni",
		studentNo: 5,
		title: "Burgjet Politike dhe Kampet",
		kicker: "Spaç, Burrel, Tepelenë, Qafë-Bari",
		years: "1945 — 1991",
		image: "/media/border.jpg",
		layout: "facts",
		lead: "Diktatura e ktheu Shqipërinë në një burg të madh. Brenda këtij burgu kishte burgje të tjera: miniera, tela me gjemba, kampe internimi ku «biografia e keqe» trashëgohej nga fëmija te fëmija.",
		body: [
			"Burgu i Spaçit, në Mirditë, mbetet emblema e punës së detyruar: të dënuarit thërmonin xehe bakri në kushte çnjerëzore. Në Qafë-Bari, Burrel, Ballsh e Tepelenë u ngritën kampe ku fëmijë e pleq internioheshin së bashku me të dënuarin politik. Internimi nuk ishte dënim gjyqësor — ishte vendim administrativ i Partisë.",
			"Instituti i Studimeve për Krimet e Komunizmit (ISKK) vlerëson rreth 34 mijë të burgosur politikë. Të dhënat zyrtare flasin për rreth 5 500 persona të ekzekutuar për arsye politike, trupat e të cilëve shpesh nuk iu kthyen kurrë familjeve. Rreth 987 të burgosur vdiqën në qeli. Për internimet, vlerësimet shkojnë nga 21 mijë (IIP) deri në rreth 60 mijë (ISKK).",
			"Pas 1991, shumë prej këtyre vendeve u lanë në harresë. Sot, memorialet e Spaçit dhe muzeumet e kujtesës janë përpjekje për ta kthyer dhimbjen në mësim: liria nuk është e dhënë, ajo mbrohet duke e kujtuar çmimin e mungesës së saj."
		],
		facts: [
			{
				label: "Të ekzekutuar",
				value: "rreth 5 500"
			},
			{
				label: "Të burgosur politikë",
				value: "19–34 mijë"
			},
			{
				label: "Të internuar",
				value: "21–60 mijë"
			},
			{
				label: "Kampet emblematike",
				value: "Spaç · Burrel · Tepelenë"
			}
		],
		quote: {
			text: "Në Spaç, dënimi nuk ishte viti. Ishte miniera, uria dhe heshtja e detyruar.",
			attrib: "Kujtesa e të dënuarve"
		},
		morph: "rise"
	},
	{
		id: "kolektivizimi",
		student: "Klodiana Shehu",
		studentNo: 6,
		title: "Kolektivizimi i Fshatit",
		kicker: "Toka që u dha dhe u mor përsëri",
		years: "1946 — 1967",
		image: "/media/village.jpg",
		layout: "split",
		lead: "Fshati shqiptar u premtua drejtësi agrare. Brenda një brezi, i njëjti fshatar që kishte marrë dynymë nga bejleri, iu desh t’ia dorëzonte tokën kooperativës — «vullnetarisht».",
		body: [
			"Pas reformës agrare, Partia nisi fushatën e kooperativave bujqësore. Fshatarët që refuzonin quheshin kulakë. Taksa, presioni i këshillit popullor dhe kërcënimi i internimit e bënë «vullnetin» të pashmangshëm. Deri në fund të viteve ’60, pothuajse e gjithë toka e punueshme ishte kolektivizuar.",
			"Kooperativa caktonte çfarë do të mbihej, sa do të merrej si «normë» dhe sa do t’i mbetej familjes. Bagëtia private u kufizua rëndë. Fshati humbi autonominë e lashtë: kalendari bujqësor u bë plan shtetëror, ndërsa dasmat, gjaqet e kanunet u sulmuan si «zakone prapanike».",
			"Në letër, kolektivizimi do të rriste prodhimin dhe barazinë. Në praktikë, Shqipëria mbeti e varur nga buka e importuar në vitet e vështira, ndërsa fshatari punonte tokën që nuk e zotëronte më. Kur sistemi ra, toka u kthye — por me plagë pronësie që zgjatën dekada."
		],
		facts: [
			{
				label: "Fillimi",
				value: "Pas reformës 1946"
			},
			{
				label: "Përfundimi gati total",
				value: "rreth 1967"
			},
			{
				label: "Forma",
				value: "Kooperativa bujqësore"
			},
			{
				label: "Kostoja",
				value: "Prona dhe liria e fshatit"
			}
		],
		quote: {
			text: "Toka u premtua si e drejtë e fshatarit dhe u kthye në pronë të Partisë.",
			attrib: "Historia agrare"
		},
		morph: "wipe"
	},
	{
		id: "industrializimi",
		student: "Besnik Dervishi",
		studentNo: 7,
		title: "Industrializimi Socialist",
		kicker: "Oçel, naftë, tekstil, hidroenergji",
		years: "1950 — 1980",
		image: "/media/factory.jpg",
		layout: "split",
		lead: "Regjimi e matte përparimin me oxhaqe e diga. Shqipëria e varfër agrare u mbush me kombinatë: Elbasani metalurgjik, tekstili i Beratit, nafta e Patosit, hidrocentralet mbi Drin.",
		body: [
			"Ndihma sovjetike e viteve ’50 dhe pastaj ajo kineze e viteve ’60–’70 financuan fabrikat e para të rënda. U ndërtuan hekurudha, uzina, miniera. Analfabetizmi teknik u luftua me shkolla profesionale. Për një brez, oxhaku ishte simbol krenarie kombëtare — dëshmi se «ne e ndërtojmë socializmin me duart tona».",
			"Por industrializimi ishte i shtrembër. Planet pesëvjeçare injoronin kërkesën reale. Kualiteti ishte i ulët, ndotja e rëndë, siguria në punë e dobët. Pas prishjes me Kinën (1978), pjesët e këmbimit mungonin. Makineritë plaken pa u zëvendësuar. Në vitet ’80, fabrikat punonin me orare të shkurtra për mungesë energjie.",
			"Trashëgimia është e dyfishtë: rrjeti i hidrocentraleve mbi Drin mbetet shtylla e energjisë shqiptare; ndërsa kombinatët e rëndë u kthyen në skelete ndryshku — monumente të një ekonomie që prodhonte për planin, jo për njeriun."
		],
		facts: [
			{
				label: "Metalurgjia",
				value: "Elbasan"
			},
			{
				label: "Nafta",
				value: "Patos — Marinëz"
			},
			{
				label: "Hidrocentralet",
				value: "Drini (Fierzë, Koman)"
			},
			{
				label: "Logjika",
				value: "Plan pesëvjeçar"
			}
		],
		quote: {
			text: "Oxhaku ndriçonte natën, por shtëpia shpesh mbetej pa dritë.",
			attrib: "Jeta industriale e viteve ’80"
		},
		morph: "burn"
	},
	{
		id: "reforma-agrare",
		student: "Teuta Marku",
		studentNo: 8,
		title: "Reforma Agrare dhe Prona",
		kicker: "Nga çifligu te shteti",
		years: "1945 — 1976",
		image: "/media/village.jpg",
		layout: "hero",
		lead: "Në një vend ku toka ishte fat, nder dhe mbijetesë, prekja e pronës ishte prekja e shpirtit shoqëror. Komunizmi e nisi me premtimin e tokës për ata që e punonin — dhe e mbylli me ndalimin kushtetues të pronës private.",
		body: [
			"Ligji i reformës agrare u shpall në gusht 1945. Çifligjet e mëdha u copëtuan. Kufiri i tokës që mund të mbante një familje u caktua rreth 5 hektarë tokë të ujitshme (me ndryshime sipas zonës). Bejlerët u shpronësuan pa kompensim; shumë u dënuan si «armiq të popullit».",
			"Kjo fazë e parë krijoi një klasë të re fshatarësh të vegjël. Por doktrina staliniste e shihte pronën e vogël si burim kapitalizmi. Prandaj erdhi kooperativa, pastaj ndërmarrja bujqësore shtetërore. Kushtetuta e vitit 1976 e ndaloi haptas pronën private mbi mjetet e prodhimit.",
			"Pas 1991, kthimi i tokës u bë një nga dramat e tranzicionit: tituj të vjetër, kufij të fshisë, ndërtime mbi parcela të pretenduara. Plaga e pronës, e hapur më 1945, mbeti e hapur edhe tridhjetë vjet pas rënies së murit ideologjik."
		],
		facts: [
			{
				label: "Ligji agrar",
				value: "Gusht 1945"
			},
			{
				label: "Shpronësimi",
				value: "Pa kompensim"
			},
			{
				label: "Kushtetuta",
				value: "1976 — ndalim i pronës"
			},
			{
				label: "Pasojë e vonë",
				value: "Kaosi pronësor pas ’91"
			}
		],
		quote: {
			text: "Kush e humbi tokën, humbi jo vetëm bukën, por edhe emrin e të parëve.",
			attrib: "Memorie fshatare"
		},
		morph: "iris"
	},
	{
		id: "ateizmi",
		student: "Gentian Duka",
		studentNo: 9,
		title: "Ateizmi Shtetëror",
		kicker: "Shteti i parë ateist i botës",
		years: "1967 — 1990",
		image: "/media/church.jpg",
		layout: "split",
		lead: "Në vitin 1967, i frymëzuar nga Revolucioni Kulturor kinez, Hoxha nisi fushatën për zhdukjen e fesë. Kisha, xhamia, teqe e manastire u mbyllën, u prishën ose u kthyen në magazi, palestra e kinema.",
		body: [
			"Shqipëria kishte qenë vend i tre besimeve — islam, ortodoks, katolik — me një traditë relativisht të qetë të bashkëjetesës. Regjimi e shpallte fenë si «opium të popullit» dhe si ndikim të huaj. Të rinjtë e aksionit u dërguan në fshatra për të shkulur ikona, për të hequr hoxhën e priftin, për të denoncuar ritin e fshehtë në shtëpi.",
			"Kushtetuta e vitit 1976, neni 37, shkruante se shteti «nuk njeh asnjë fe» dhe mbështet propagandën ateiste. Kleri u burgos, u internua ose u ekzekutua. Pagëzimi, suneti, krishtlindjet e bajrami u bënë veprime të rrezikshme. Mbi 2 000 objekte fetare u mbyllën ose u shkatërruan.",
			"Por feja nuk vdiq. Ajo u fsheh në kujtesën e gjysheve, në një qiri të ndezur pas perdes, në një varr pa kryq të dukshëm. Në 1990–91, kishat e xhamitë u rihapën me një shpërthim emocional — dëshmi se shteti mund të mbyllë dyert, por jo shpirtin."
		],
		facts: [
			{
				label: "Fushata",
				value: "1967"
			},
			{
				label: "Kushtetuta, neni 37",
				value: "1976"
			},
			{
				label: "Objekte të mbyllura",
				value: "mbi 2 000"
			},
			{
				label: "Rihapja",
				value: "1990 — 1991"
			}
		],
		quote: {
			text: "Shteti e shpalli veten ateist. Populli e mbajti Zotin në heshtje.",
			attrib: "Historia e besimit të ndaluar"
		},
		morph: "rise"
	},
	{
		id: "bunkeret",
		student: "Ada Çela",
		studentNo: 10,
		title: "Bunkerizimi i Vendit",
		kicker: "Beton kundër një armiku që nuk erdhi",
		years: "1967 — 1986",
		image: "/media/bunkers.jpg",
		layout: "facts",
		lead: "Asnjë peizazh europian nuk mban kaq shumë beton ushtarak. Bunkerët — kërpudhat e grira të Hoxhës — janë në plazh, në varreza, në fusha gruri e në mes të lagjeve.",
		body: [
			"Doktrina e «luftës popullore» kërkonte që çdo qytetar të mbronte vendin e vet. Nga fundi i viteve ’60 deri më 1986 u ngritën qindra mijëra fortifikime. Sipas të dhënave të vitit 1983, u ndërtuan 173 371 bunkerë betoni — rreth 5,7 për kilometër katror, ose thuajse një për çdo njëmbëdhjetë banorë.",
			"Tipi më i zakonshëm, QZ (qendër zjarri), ishte kupola e vogël me të çarë për pushkë. Kishte edhe tunel komplekse, si ai i Linzës pranë Tiranës, i gërmuar për ministritë dhe Sigurimin në rast sulmi bërthamor. Qindra ushtarë e civilë vdiqën në aksidente ndërtimi — viktima të harruara të një lufte që nuk ndodhi kurrë.",
			"Kostoja ishte e jashtëzakonshme për një ekonomi të varfër: çimento, hekur, krah pune, tokë bujqësore e humbur. Bunkerët nuk u përdorën kurrë për mbrojtje. Sot disa janë muze (Bunk’Art), disa kafene, shumica rrënoja. Ato mbeten metafora e një regjimi që i frikësohej botës më shumë sesa i besonte popullit të vet."
		],
		facts: [
			{
				label: "Numri (1983)",
				value: "173 371"
			},
			{
				label: "Dendësia",
				value: "5,7 / km²"
			},
			{
				label: "Tipi kryesor",
				value: "QZ — qendër zjarri"
			},
			{
				label: "Përdorimi luftarak",
				value: "Asnjëherë"
			}
		],
		quote: {
			text: "Betoni u derdh për t’u mbrojtur nga bota. Në të vërtetë, bota u mbyll jashtë nesh.",
			attrib: "Mbi bunkerizimin"
		},
		morph: "iris"
	},
	{
		id: "izolimi",
		student: "Ilir Nikolla",
		studentNo: 11,
		title: "Izolimi Ndërkombëtar",
		kicker: "Jugosllavia, Moska, Pekini, pastaj askush",
		years: "1948 — 1990",
		image: "/media/border.jpg",
		layout: "split",
		lead: "Shqipëria e Hoxhës prishi me të gjithë aleatët e saj. Në fund mbeti një ishull ideologjik: armiqësi njëkohësisht me Perëndimin, me Jugosllavinë, me Bashkimin Sovjetik dhe me Kinën.",
		body: ["Në 1948, pas përçarjes Tito–Stalin, Hoxha zgjodhi Moskën dhe dënoi «titizmin». Shumë kuadro u pushkatuan si agjentë jugosllavë. Në 1961, pas destalinizimit të Hrushovit, Tiranë u nda nga Kremlini. Në 1968, në shenjë proteste ndaj pushtimit të Çekosllovakisë, Shqipëria doli nga Traktati i Varshavës.", "Aleanca me Kinën e Maos solli kredi, fabrikë e libra të kuq. Por pas vizitës së Nixonit në Pekin (1972) dhe vdekjes së Maos, Hoxha i shpalli kinezët revizionistë. Në 1978 ndihma kineze u ndërpre. Mbeti dogma e «vetëbesimit»: të prodhonim gjithçka vetë, të mos merrnim kredi, të mos hapnim kufijtë."],
		facts: [
			{
				label: "Prishja me Jugosllavinë",
				value: "1948"
			},
			{
				label: "Prishja me BRSS",
				value: "1961"
			},
			{
				label: "Dalja nga Varshava",
				value: "1968"
			},
			{
				label: "Prishja me Kinën",
				value: "1978"
			}
		],
		quote: {
			text: "Kufiri u bë jo vetëm vijë e hartës, por mur i mendjes.",
			attrib: "Epoka e vetëbesimit"
		},
		morph: "wipe"
	},
	{
		id: "jeta",
		student: "Blerta Kola",
		studentNo: 12,
		title: "Jeta e Përditshme",
		kicker: "Radha, kartela, pallati, heshtja",
		years: "1960 — 1990",
		image: "/media/queue.jpg",
		layout: "hero",
		lead: "Historia e madhe shkruhet me kongrese. Historia e vërtetë jetojëj në radhën e bukës, në dhomën e ngushtë të pallatit dhe në bisedën e ulët pas orës dhjetë, kur fëmijët flinin.",
		body: [
			"Makina private pothuajse nuk ekzistonin për qytetarin e rëndomtë. Televizori, frigoriferi, biçikleta ishin mallra të vështira. Ushqimi shpërndahej me kartela: vaj, sheqer, mish i rrallë, kafe e ndaluar ose e zëvendësuar. Në vitet ’80, ndërprerjet e dritës ishin pjesë e rutinës — sidomos në Qytetin Studenti, ku errësira e dhjetorit 1990 u bë shkëndija e protestës.",
			"Pallati i ri socialist — blloqet e betonit — ndryshoi fytyrën e Tiranës, Durrësit, Elbasanit. Banorët jetonin ngushtë, shpesh me dy breza në të njëjtën banesë. Lagjja kishte këshillin, përgjegjësin e derës, shtëpinë e pionierit. Privatësia ishte e dyshimtë; «individualizmi» ishte faj.",
			"Megjithatë, njerëzit dasmëronin, këndonin, shkonin në plazh në Durrës, ndiqnin ndeshje, lexonin Kadarenë mes rreshtave. Jeta e përditshme nuk ishte vetëm shtypje: ishte edhe dashuri, humor i hidhur, mikpritje. Diktatura e kontrolloi ditën, por nuk e shfuqizoi njeriun."
		],
		facts: [
			{
				label: "Makina private",
				value: "Pothuajse të ndaluara"
			},
			{
				label: "Ushqimi",
				value: "Kartela e radhë"
			},
			{
				label: "Banesa",
				value: "Pallate shtetërore"
			},
			{
				label: "Energjia e viteve ’80",
				value: "Ndërprerje të shpeshta"
			}
		],
		quote: {
			text: "Në radhë njerëzit flisnin pak. Sytë flisnin më shumë se goja.",
			attrib: "Kujtime të viteve ’80"
		},
		morph: "burn"
	},
	{
		id: "arsimi",
		student: "Endrit Basha",
		studentNo: 13,
		title: "Arsimi, Rinia dhe Ideologjia",
		kicker: "Shkolla që çliroi dhe që robëroi",
		years: "1945 — 1991",
		image: "/media/classroom.jpg",
		layout: "split",
		lead: "Komunizmi e gjeti Shqipërinë me analfabetizëm masiv, veçanërisht ndër gra e fshatarë. Fushatat e ndriçimit ishin një nga sukseset e pakta të padiskutueshme — por shkolla u bë edhe katedra e Partisë.",
		body: [
			"Lufta kundër analfabetizmit, e ngritur që në vitet e para, e ktheu shkrimin në të drejtë të gjithëve. Arsimi fillor u bë i detyrueshëm. U ngritën shkolla 7- dhe 8-vjeçare, gjimnaze, universitete. Për bijtë e fshatit, diploma ishte shkallë shoqërore e paimagjinueshme para luftës.",
			"Por programi ishte i ngopur me marksizëm-leninizëm. Historia ishte historia e Partisë. Letërsia filtrohej. Biografia vendoste kush shkonte në universitet. Rinia e Bashkuar e Punës së Shqipërisë organizonte aksione vullnetare, stërvitje ushtarake dhe «edukim komunist». Fletërrufetë, të sjella nga modeli kinez më 1967, turpëronin nxënësit para klasës.",
			"Paradoksi mbetet: i njëjti sistem që hapi librin për miliona, e mbylli librin tjetër — atë të dyshimit. Prandaj rënia e diktaturës nisi pikërisht nga shkolla e lartë: studentët e Tiranës, të ushqyer me slogane, kërkuan Europën."
		],
		facts: [
			{
				label: "Analfabetizmi",
				value: "Pothuajse i zhdukur"
			},
			{
				label: "Arsimi fillor",
				value: "I detyrueshëm"
			},
			{
				label: "Organizata e rinisë",
				value: "Rinia e Bashkuar"
			},
			{
				label: "Fletërrufetë",
				value: "Nga 1967"
			}
		],
		quote: {
			text: "Na mësuan të lexonim, por jo të pyesnim.",
			attrib: "Një brez i shkollës së diktaturës"
		},
		morph: "blade"
	},
	{
		id: "grate",
		student: "Sara Lleshi",
		studentNo: 14,
		title: "Gratë në Kohën e Diktaturës",
		kicker: "Emancipimi i urdhëruar",
		years: "1944 — 1991",
		image: "/media/village.jpg",
		layout: "split",
		lead: "Gratë shqiptare hynë në luftë si partizane dhe dolën në paqe si fuqi pune e shtetit. Barazia u shkrua në ligj; jeta e dyfishtë — fabrika ditën, shtëpia natën — mbeti mbi supet e tyre.",
		body: [
			"Bashkimi i Grave të Shqipërisë dhe revista «Shqiptarja e Re» (1943–1991) e ndërtuan figurën e gruas së re socialiste: e shkolluar, e palodhur, besnike e Partisë. Në qershor 1967, Plenumi i Dytë i KQ të PPSH-së nisi fushatën «për emancipimin e plotë të gruas». Kanunet, şeriati, prika dhe mbyllja e vajzës u sulmuan si prapambetje.",
			"Rezultatet ishin të vërteta: arsimi femëror u rrit dramatike; gratë hynë në mjekësi, mësimdhënie, industri, madje në ushtri. Por propaganda fshihte pabarazinë e mbetur. Gruaja duhej të punonte «si burri», të bënte aksion, të rrite fëmijët dhe të tregonte besnikëri politike. Homosexualiteti mbeti i dënuar; trupi dhe familja mbetën fusha kontrolli.",
			"Emancipimi i urdhëruar nga lart nuk është i njëjtë me lirinë e zgjedhur. Ai hapi dyer që nuk duhet të mbyllen më, por e bëri gruan edhe një ushtare të planit pesëvjeçar. Sot, të kuptuarit e kësaj trashëgimie na ndihmon të ndajmë të drejtën e fituar nga çmimi i paguar."
		],
		facts: [
			{
				label: "BGSH / revista",
				value: "Shqiptarja e Re"
			},
			{
				label: "Plenumi i emancipimit",
				value: "Qershor 1967"
			},
			{
				label: "Arritja",
				value: "Arsim e punë masive"
			},
			{
				label: "Kostoja",
				value: "Puna e dyfishtë + kontrolli"
			}
		],
		quote: {
			text: "Na thanë: jeni të barabarta. Na lanë: të lodhura dy herë.",
			attrib: "Dëshmi e grave të brezit të diktaturës"
		},
		morph: "rise"
	},
	{
		id: "kultura",
		student: "Fatmir Spahiu",
		studentNo: 15,
		title: "Kultura, Letërsia dhe Censura",
		kicker: "Realizmi socialist dhe fjala e ndaluar",
		years: "1945 — 1991",
		image: "/media/classroom.jpg",
		layout: "hero",
		lead: "Kultura u shpall «në shërbim të popullit». Në praktikë, ajo u vu në shërbim të Partisë. Libri, filmi, kënga e piktura duhej të tregonin heroun pozitiv, fabrikën dhe armikun e klasës.",
		body: [
			"Realizmi socialist ishte metoda e detyrueshme. Lidhja e Shkrimtarëve dhe Artistëve e filtroi çdo vepër. Botuesi shtetëror «Naim Frashëri» vendoste çfarë dilte në dritë. Shkrimtarë u burgosën; të tjerë u heshtën; disa mësuan të shkruanin me dy zëra: një për censurën, një për lexuesin e vëmendshëm.",
			"Ismail Kadare ndërtoi një vepër që, edhe brenda kufijve, e çoi letërsinë shqipe në botë. Filmat e Kinostudios «Shqipëria e Re» — lufta partizane, fshati, satira e kujdesshme — mbeten pjesë e kujtesës kolektive. Muzika e lejuar ishte kënga e aksionit; xhazzi e rock-u ishin «degenerim perëndimor».",
			"Censura nuk vrau vetëm veprat. Ajo vrau guximin për të thënë «nuk e di». Kur ra sistemi, raftet u mbushën me tituj të ndaluar, por boshllëku i një gjysmë shekulli nuk mbushët për një natë. Liria e fjalës duhet mësuar, ashtu siç ishte mësuar heshtja."
		],
		facts: [
			{
				label: "Metoda",
				value: "Realizmi socialist"
			},
			{
				label: "Kinostudio",
				value: "Shqipëria e Re"
			},
			{
				label: "Botuesi",
				value: "Naim Frashëri"
			},
			{
				label: "Kufiri",
				value: "Censura paraprake"
			}
		],
		quote: {
			text: "Në diktaturë, metafora ishte ndonjëherë e vetmja dritare e hapur.",
			attrib: "Mbi letërsinë e periudhës"
		},
		morph: "wipe"
	},
	{
		id: "propaganda",
		student: "Jonida Pasha",
		studentNo: 16,
		title: "Propaganda, Shtypi dhe Radio",
		kicker: "Një zë, një e vërtetë, një portret",
		years: "1944 — 1991",
		image: "/media/factory.jpg",
		layout: "split",
		lead: "Në Shqipërinë komuniste nuk kishte media. Kishte megafon. «Zëri i Popullit», Radio Tirana dhe televizioni shtetëror flisnin me të njëjtën fjali: Partia di, populli ndjek, armiku rrethon.",
		body: [
			"Gazeta e Partisë, «Zëri i Popullit», caktonte linjën e ditës. Radio Tirana transmetonte edhe në gjuhë të huaja, duke e paraqitur Shqipërinë si far të marksizmit të pastër. Televizioni, i kufizuar, tregonte mitingje, aksione dhe filme të lejuara. Lajmi i jashtëm filtrohej deri në absurditet: bota ose ishte në krizë kapitaliste, ose në tradhti revizioniste.",
			"Fletërrufetë e vitit 1967 e sollën propagandën në murin e shkollës e të fabrikës. Emri i «armikut» shkruhej me të kuqe. Autokritika publike ishte teatër i frikës. Portretet e Hoxhës, sloganet në beton, këngët e 1 Majit dhe paradat e 29 Nëntorit e mbushnin hapësirën publike, që të mos mbetej vend për pyetje.",
			"Propaganda funksionoi sepse nuk kishte konkurrent. Kur në 1990 erdhën imazhet e Europës — ngjyrat, dyqanet, fjalët e lira — goditja ishte më e fortë se çdo traktat. Një shoqëri e ushqyer me një të vërtetë të vetme u përplas me shumë të vërteta përnjëherësh."
		],
		facts: [
			{
				label: "Organi i Partisë",
				value: "Zëri i Popullit"
			},
			{
				label: "Radio",
				value: "Radio Tirana"
			},
			{
				label: "Fletërrufetë",
				value: "Nga 1967"
			},
			{
				label: "Televizioni",
				value: "Shtetëror, i kontrolluar"
			}
		],
		quote: {
			text: "Kur të gjithë gazetat thonë të njëjtën gjë, asnjëra nuk thotë të vërtetën.",
			attrib: "Mësim mbi median e lirë"
		},
		morph: "blade"
	},
	{
		id: "sporti",
		student: "Erion Vila",
		studentNo: 17,
		title: "Sporti dhe Krenaria e Mbyllur",
		kicker: "Fusha e lojës, fusha e Partisë",
		years: "1945 — 1991",
		image: "/media/pallate.jpg",
		layout: "split",
		lead: "Në një vend të izoluar, sporti ishte një nga të paktat dritare ku shqiptari mund të ndiente se ekzistonte në botë. Por edhe stadiumi kishte tribunën e Partisë.",
		body: [
			"Klubet e mëdha — Partizani, Dinamo, 17 Nëntori — i përkisnin ushtrisë, Ministrisë së Brendshme ose kryeqytetit. Talenti merrej nga fshati, stërvitej në internat, vishte fanellën e shtetit. Fitoret në Balkaniadë apo në ndeshje të rralla ndërkombëtare bëheshin mit. Humbjet rrezikonin karrierën e trajnerit.",
			"Izolimi e varfëroi sportin: pak takime me Perëndimin, dyshime ndaj «ikjes» së sportistëve, kontroll i rreptë në udhëtime. E megjithatë, mundja, xhudoja, qitja, futbolli e atletika prodhuan emra që populli i deshi pa leje partie. Në stadium, për dy orë, slogani zëvendësohej nga britma e golit.",
			"Sporti tregon dy fytyra të epokës: disiplinën kolektive që ndërtoi trupa të fortë, dhe kufirin që i ndaloi ata trupa të luanin lirisht me botën. Pas 1991, shumë talente ikën. Ajo ikje ishte edhe lëndim, edhe dëshmi se ëndrra kishte qenë më e gjerë se kufiri."
		],
		facts: [
			{
				label: "Klubet emblematike",
				value: "Partizani · Dinamo · 17 Nëntori"
			},
			{
				label: "Misioni",
				value: "Prestigj i shtetit"
			},
			{
				label: "Kufizimi",
				value: "Udhëtime të kontrolluara"
			},
			{
				label: "Pasojë",
				value: "Ikja e talenteve pas ’91"
			}
		],
		quote: {
			text: "Në stadium njerëzit britnin lirisht — për herë të parë në javë.",
			attrib: "Kujtesë e tifozit"
		},
		morph: "iris"
	},
	{
		id: "ekonomia",
		student: "Besa Kastrati",
		studentNo: 18,
		title: "Ekonomia e Vetëbesimit",
		kicker: "Plani, mungesa, krizë e viteve ’80",
		years: "1978 — 1991",
		image: "/media/queue.jpg",
		layout: "facts",
		lead: "Pas prishjes me Kinën, Shqipëria e shpalli «vetëbesimin» doktrinë ekonomike: pa kredi të huaja, pa treg, pa pronë private. Ishte krenari e rrezikshme — dhe pastaj uria e ngadaltë.",
		body: [
			"Ekonomia komandohej nga Komisioni i Planit. Çmimet, pagat, prodhimi, eksporti — gjithçka vendosej në Tiranë. Tregtia e brendshme ishte rrjet dyqanesh shtetërore. Dollari dhe valuta ishin krim. Kush kishte lidhje, gjente kafe dhe jeans; kush s’kishte, priste në radhë.",
			"Në vitet ’80, sistemi u rraskapit. Makineritë kineze e sovjetike s’kishin pjesë këmbimi. Tharja e tokës dhe keqmenaxhimi ulën prodhimin bujqësor. Energjia mungonte. Borxhi i jashtëm ishte i ulët — kjo ishte krenaria e Hoxhës — por standardi i jetesës ra. Në 1990, dyqanet ishin bosh, ndërsa populli kishte dëgjuar se përtej kufirit raftet ishin plot.",
			"Tranzicioni i viteve ’90 e shkatërroi këtë arkitekturë brenda natës: privatizime të shpejta, papunësi, piramida. Të kuptuarit e ekonomisë së diktaturës na tregon pse liria politike nuk mjafton pa institucione të shëndosha tregu — dhe pse nostalgia për «sigurinë» e radhës është kurth."
		],
		facts: [
			{
				label: "Doktrina",
				value: "Vetëbesimi (pas 1978)"
			},
			{
				label: "Prona",
				value: "Shtetërore / kooperativë"
			},
			{
				label: "Valuta e huaj",
				value: "E ndaluar"
			},
			{
				label: "Kriza",
				value: "Mungesa e viteve ’80"
			}
		],
		quote: {
			text: "Shteti kishte plan për çdo gjë, përveç dëshirës së njeriut.",
			attrib: "Mbi ekonominë e komanduar"
		},
		morph: "burn"
	},
	{
		id: "ramiz-alia",
		student: "Lorenc Rama",
		studentNo: 19,
		title: "Pas Hoxhës: Ramiz Alia",
		kicker: "Vazhdimi i sistemit me fytyrë të re",
		years: "1985 — 1991",
		image: "/media/pallate.jpg",
		layout: "split",
		lead: "Më 11 prill 1985 vdiq Enver Hoxha. Pushtetin e mori Ramiz Alia, i besuari i tij. Shqipëria nuk u hap. Ajo u përpoq të mbijetonte duke lëshuar ca milimetra — ndërsa Europa Lindore po rrëzonte mure.",
		body: [
			"Alia lejoi disa masa të kujdesshme: pak më shumë treg, ndonjë lehtësim të Sigurimit, nënshkrimin e Aktit Final të Helsinkit, një gjuhë më pak të ashpër. Por PPSH mbeti e vetmja parti. Në 1989, kur ra Muri i Berlinit dhe u rrëzua Çaushesku, Tiranë u dridh. Në Shkodër u sulmua statuja e Stalinit. Refugjatë hynë në ambasada.",
			"Alia shpresonte se «demokracia socialiste» mund të reformohej pa e humbur Partinë. Historia vendosi ndryshe. Studentët e dhjetorit 1990 e detyruan të pranonte pluralizmin. Zgjedhjet e 31 marsit 1991 i fitoi ende Partia, por autoriteti moral ishte thyer. Në 1992, Partia Demokratike erdhi në pushtet dhe epoka e njëpartie mbaroi.",
			"Figura e Alisë mbetet e ndërlikuar: jo Hoxha, por as reformatori i vërtetë. Ai e vonoi gjakderdhjen e madhe, por e vonoi edhe lirinë. Për ne, mësimi është se diktaturat rrallë vdesin nga lart; ato ulet kur poshtë nuk ka më frikë."
		],
		facts: [
			{
				label: "Vdekja e Hoxhës",
				value: "11 prill 1985"
			},
			{
				label: "Pasardhësi",
				value: "Ramiz Alia"
			},
			{
				label: "Helsinki",
				value: "Të drejtat e njeriut, vonë"
			},
			{
				label: "Pluralizmi i pranuar",
				value: "11 dhjetor 1990"
			}
		],
		quote: {
			text: "Ai nuk e ndërtoi diktaturën, por e mbajti në këmbë derisa populli ia hoqi.",
			attrib: "Mbi trashëgiminë e Alisë"
		},
		morph: "wipe"
	},
	{
		id: "renia",
		student: "Xhensila Meta",
		studentNo: 20,
		title: "Dhjetori 1990: Rënia",
		kicker: "«E duam Shqipërinë si gjithë Europa»",
		years: "1990 — 1991",
		image: "/media/protest.jpg",
		layout: "hero",
		lead: "Mbrëmjen e 8 dhjetorit 1990, Qyteti Studenti mbeti në errësirë. Mungesa e dritës, e ujit, e shpresës — u bë britmë. Ajo që nisi si revoltë për kushtet e konviktit, u kthye në kërkesën më të rëndë: liri politike.",
		body: [
			"Tërdhjetë studentë, me Azem Hajdarin në krye, kërkuan takim me Ramiz Alinë. Policia i rrethoi; populli nisi t’i mbështeste. Më 9 e 10 dhjetor protesta u bë masive. Parrulla që e mbylli epokën ishte e thjeshtë dhe e pathyeshme: «E duam Shqipërinë si gjithë Europa».",
			"Më 11 dhjetor 1990, Alia pranoi pluralizmin. Më 12 dhjetor u krijua Partia Demokratike. Kisha e xhamia u rihapën. Statuja e Hoxhës në Tiranë u rrëzua në shkurt 1991. Zgjedhjet e 31 marsit 1991 ishin të parat shumëpartiake: PPSH fitoi në fshat, opozita në qytetet e mëdha. Tranzicioni do të ishte i ashpër — por diktatura njëpartiake kishte mbaruar.",
			"Ne, nxënësit e klasës XI-B, e tregojmë këtë histori jo për t’u hakmarrë me të vdekurit, por për t’i mbrojtur të gjallët. Liria e fjalës, e besimit, e lëvizjes dhe e votës nuk janë dekor. Ato janë kujtesa jonë e kthyer në të drejtë."
		],
		facts: [
			{
				label: "Fillimi i protestës",
				value: "8 dhjetor 1990"
			},
			{
				label: "Pluralizmi",
				value: "11 dhjetor 1990"
			},
			{
				label: "Partia Demokratike",
				value: "12 dhjetor 1990"
			},
			{
				label: "Zgjedhjet e para",
				value: "31 mars 1991"
			}
		],
		quote: {
			text: "E duam Shqipërinë si gjithë Europa.",
			attrib: "Parrulla e studentëve, dhjetor 1990"
		},
		morph: "rise"
	}
];
var TIMELINE = [
	{
		year: "1944",
		text: "Çlirimi. Fillon pushteti komunist."
	},
	{
		year: "1946",
		text: "Republika Popullore. Reforma agrare."
	},
	{
		year: "1948",
		text: "Prishja me Jugosllavinë."
	},
	{
		year: "1961",
		text: "Prishja me Bashkimin Sovjetik."
	},
	{
		year: "1967",
		text: "Ateizmi shtetëror. Fillon bunkerizimi."
	},
	{
		year: "1968",
		text: "Dalja nga Traktati i Varshavës."
	},
	{
		year: "1976",
		text: "Kushtetuta: shteti nuk njeh asnjë fe."
	},
	{
		year: "1978",
		text: "Prishja me Kinën. Vetëbesimi."
	},
	{
		year: "1985",
		text: "Vdes Enver Hoxha. Vjen Ramiz Alia."
	},
	{
		year: "1990",
		text: "Protesta studentore. Pluralizmi."
	},
	{
		year: "1991",
		text: "Zgjedhjet e para shumëpartiake."
	}
];
var MORPH_CLASS = {
	iris: "morph-iris",
	wipe: "morph-wipe",
	blade: "morph-blade",
	rise: "morph-rise",
	burn: "morph-burn"
};
function Documentary() {
	const [phase, setPhase] = (0, import_react.useState)("intro");
	const [index, setIndex] = (0, import_react.useState)(0);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [tocOpen, setTocOpen] = (0, import_react.useState)(false);
	const [autoplay, setAutoplay] = (0, import_react.useState)(false);
	const [animKey, setAnimKey] = (0, import_react.useState)(0);
	const scoreRef = (0, import_react.useRef)(null);
	const touchX = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		scoreRef.current = createScore();
		return () => scoreRef.current?.stop();
	}, []);
	(0, import_react.useEffect)(() => {
		scoreRef.current?.setMuted(muted);
	}, [muted]);
	const startAudio = (0, import_react.useCallback)(() => {
		scoreRef.current?.start();
	}, []);
	const goShow = (0, import_react.useCallback)((i) => {
		startAudio();
		setIndex(i);
		setPhase("show");
		setTocOpen(false);
		setAnimKey((k) => k + 1);
	}, [startAudio]);
	const next = (0, import_react.useCallback)(() => {
		if (phase === "intro") {
			startAudio();
			setPhase("toc");
			return;
		}
		if (phase === "toc") {
			goShow(0);
			return;
		}
		if (phase === "outro") return;
		if (index >= slides.length - 1) {
			setPhase("outro");
			setAnimKey((k) => k + 1);
			return;
		}
		setIndex((i) => i + 1);
		setAnimKey((k) => k + 1);
	}, [
		phase,
		index,
		goShow,
		startAudio
	]);
	const prev = (0, import_react.useCallback)(() => {
		if (phase === "outro") {
			setPhase("show");
			setIndex(slides.length - 1);
			setAnimKey((k) => k + 1);
			return;
		}
		if (phase !== "show") return;
		if (index <= 0) {
			setPhase("toc");
			return;
		}
		setIndex((i) => i - 1);
		setAnimKey((k) => k + 1);
	}, [phase, index]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
				e.preventDefault();
				next();
			} else if (e.key === "ArrowLeft") {
				e.preventDefault();
				prev();
			} else if (e.key === "Escape") setTocOpen(false);
			else if (e.key === "Home") setPhase("toc");
			else if (e.key === "End") setPhase("outro");
			else if (e.key === "m" || e.key === "M") setMuted((m) => !m);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [next, prev]);
	(0, import_react.useEffect)(() => {
		if (!autoplay || phase !== "show") return;
		const id = window.setInterval(() => next(), 16e3);
		return () => window.clearInterval(id);
	}, [
		autoplay,
		phase,
		next
	]);
	const onTouchStart = (e) => {
		touchX.current = e.changedTouches[0]?.clientX ?? null;
	};
	const onTouchEnd = (e) => {
		const start = touchX.current;
		const end = e.changedTouches[0]?.clientX;
		touchX.current = null;
		if (start == null || end == null) return;
		const dx = end - start;
		if (dx < -56) next();
		if (dx > 56) prev();
	};
	const slide = slides[index];
	const progress = phase === "show" ? (index + 1) / slides.length : phase === "outro" ? 1 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "film-grain relative min-h-dvh overflow-x-hidden bg-ink text-parchment",
		onTouchStart,
		onTouchEnd,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette pointer-events-none absolute inset-0 z-10" }),
			phase === "intro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Intro, { onEnter: next }),
			phase === "toc" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableOfContents, {
				onOpen: goShow,
				onBegin: () => goShow(0)
			}),
			phase === "show" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlideStage, {
				slide,
				index
			}, animKey),
			phase === "outro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outro, { onReplay: () => {
				setPhase("intro");
				setIndex(0);
				setAutoplay(false);
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chrome, {
				phase,
				index,
				progress,
				muted,
				autoplay,
				onMute: () => setMuted((m) => !m),
				onAutoplay: () => setAutoplay((a) => !a),
				onPrev: prev,
				onNext: next,
				onToc: () => {
					if (phase === "show") setTocOpen(true);
					else setPhase("toc");
				}
			}),
			tocOpen && phase === "show" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TocOverlay, {
				current: index,
				onClose: () => setTocOpen(false),
				onPick: (i) => goShow(i)
			})
		]
	});
}
function Intro({ onEnter }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative flex min-h-dvh items-center justify-center overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				className: "absolute inset-0 size-full object-cover kenburns",
				src: "/media/intro.mp4",
				poster: "/media/bunkers.jpg",
				autoPlay: true,
				muted: true,
				loop: true,
				playsInline: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-b from-ink/70 via-ink/55 to-ink" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-crimson-deep/20 mix-blend-multiply" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EagleMark, { className: "mb-6 size-20 animate-[eagle-in_1.2s_cubic-bezier(0.22,1,0.36,1)_both] text-gold sm:size-24" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[0.7rem] tracking-[0.38em] text-gold uppercase stagger-in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: SCHOOL })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-display text-[0.65rem] tracking-[0.32em] text-muted uppercase",
						children: [CLASS_NAME, " · Projekt historik"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-6 block h-px w-28 origin-center bg-gold animate-[draw-line_1s_0.4s_cubic-bezier(0.22,1,0.36,1)_both]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-6 font-display text-4xl leading-[1.05] font-semibold text-parchment sm:text-6xl md:text-7xl",
						children: PROJECT_TITLE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-display text-lg tracking-[0.28em] text-gold sm:text-2xl",
						children: PROJECT_YEARS
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md font-body text-sm leading-relaxed text-muted italic sm:text-base",
						children: "Një kujtesë kolektive e njëzet nxënësve mbi diktaturën, izolimin dhe ditën kur Shqipëria kërkoi Europën."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onEnter,
						className: "mt-10 border border-gold/50 bg-crimson/80 px-8 py-3.5 font-display text-xs tracking-[0.28em] text-parchment uppercase transition-transform duration-150 ease-out hover:bg-crimson hover:text-gold-soft active:scale-[0.96]",
						children: "Hyni në kujtesë"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-[0.7rem] tracking-widest text-muted uppercase",
						children: "Shtypni për kolonën zanore · shigjetat për rrëfimin"
					})
				]
			})
		]
	});
}
function TableOfContents({ onOpen, onBegin }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative min-h-dvh overflow-y-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/bunkers.jpg",
				alt: "",
				className: "absolute inset-0 size-full object-cover opacity-35 kenburns"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "stagger-in mb-8 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase",
								children: [
									SCHOOL,
									" · ",
									CLASS_NAME
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-3xl text-parchment sm:text-5xl",
								children: "Njëzet zëra, një kujtesë"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base",
								children: "Secili nxënës mban një kapitull të Shqipërisë 1944–1991. Zgjidhni pjesën, ose nisini rrëfimin nga e para."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onBegin,
								className: "mt-6 border border-gold bg-crimson px-8 py-3 font-display text-xs tracking-[0.28em] text-parchment uppercase transition-transform duration-150 hover:bg-crimson-deep active:scale-[0.96]",
								children: "Nisi rrëfimin"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2",
						children: slides.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onOpen(i),
							className: "group flex w-full items-center gap-4 border border-border/70 bg-surface/70 px-4 py-3 text-left backdrop-blur-sm transition-colors duration-200 hover:border-gold/50 hover:bg-raised",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm text-gold tabular-nums",
								children: String(s.studentNo).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-display text-sm text-parchment group-hover:text-gold-soft",
									children: s.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-xs text-muted",
									children: [
										s.student,
										" · ",
										s.years
									]
								})]
							})]
						}) }, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex justify-center pb-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onBegin,
							className: "border border-gold bg-crimson px-8 py-3 font-display text-xs tracking-[0.28em] text-parchment uppercase transition-transform duration-150 hover:bg-crimson-deep active:scale-[0.96]",
							children: "Nisi rrëfimin"
						})
					})
				]
			})
		]
	});
}
function SlideStage({ slide, index }) {
	const morph = MORPH_CLASS[slide.morph];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("relative min-h-dvh", morph),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: slide.image,
				alt: "",
				className: "absolute inset-0 size-full object-cover kenburns"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-r from-ink from-5% via-ink/90 to-ink/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-ink/55" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col justify-end px-4 pb-28 pt-20 sm:justify-center sm:px-8 sm:pt-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("stagger-in grid gap-8", slide.layout === "facts" ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[1.25fr_0.75fr]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-[0.68rem] tracking-[0.28em] text-gold uppercase",
							children: [
								"Pjesa ",
								String(slide.studentNo).padStart(2, "0"),
								" · ",
								slide.student
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-[0.7rem] tracking-[0.22em] text-muted uppercase",
							children: [
								slide.kicker,
								" · ",
								slide.years
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 max-w-3xl font-display text-3xl leading-tight font-semibold text-parchment sm:text-5xl",
							children: slide.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-2xl text-base leading-relaxed text-parchment/90 sm:text-lg",
							children: slide.lead
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-5 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm leading-relaxed text-parchment/85 sm:max-h-none sm:text-base",
							children: slide.body.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 24)))
						}),
						slide.quote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "mt-6 max-w-xl border-l-2 border-gold pl-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-body text-base text-parchment italic sm:text-lg",
								children: [
									"“",
									slide.quote.text,
									"”"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
								className: "mt-2 text-xs tracking-wide text-muted uppercase",
								children: slide.quote.attrib
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "self-end border border-border/80 bg-surface/75 p-5 backdrop-blur-md sm:self-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[0.65rem] tracking-[0.28em] text-gold uppercase",
								children: "Datat & shifrat"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "mt-4 grid grid-cols-2 gap-4",
								children: slide.facts.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-[0.65rem] tracking-wide text-muted uppercase",
									children: f.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 font-display text-sm text-parchment sm:text-base",
									children: f.value
								})] }, f.label))
							}),
							index === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-6 hidden space-y-1.5 border-t border-border pt-4 lg:block",
								children: TIMELINE.slice(0, 6).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-3 text-xs text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-gold",
										children: t.year
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.text })]
								}, t.year))
							})
						]
					})]
				})
			})
		]
	});
}
function Outro({ onReplay }) {
	const names = (0, import_react.useMemo)(() => slides, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative flex min-h-dvh items-center overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/media/protest.jpg",
				alt: "",
				className: "absolute inset-0 size-full object-cover kenburns"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/85" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto w-full max-w-5xl px-4 py-20 text-center sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EagleMark, { className: "mx-auto mb-5 size-16 text-gold animate-[eagle-in_1.2s_both]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-[0.7rem] tracking-[0.35em] text-gold uppercase",
						children: [
							SCHOOL,
							" · ",
							CLASS_NAME
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-3xl text-parchment sm:text-5xl",
						children: "Kujtesa është liria"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base",
						children: "Ky projekt u ndërtua nga njëzet nxënës. Secili mbajti një pjesë të së vërtetës, që e vërteta e plotë të mos harrohet. 1944–1991 nuk është vetëm datë: është paralajmërim."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "stagger-in mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-2 text-left sm:grid-cols-2",
						children: names.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-3 border-b border-border/50 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-display text-sm text-parchment",
								children: s.student
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "shrink-0 font-display text-[0.65rem] text-gold",
								children: String(s.studentNo).padStart(2, "0")
							})]
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
						className: "mx-auto mt-10 max-w-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-body text-lg text-parchment italic sm:text-xl",
							children: "“E duam Shqipërinë si gjithë Europa.”"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
							className: "mt-2 text-xs tracking-widest text-muted uppercase",
							children: "Studentët e dhjetorit 1990"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onReplay,
						className: "mt-10 inline-flex items-center gap-2 border border-gold/60 px-6 py-3 font-display text-xs tracking-[0.24em] text-gold uppercase transition-transform duration-150 hover:bg-crimson/40 active:scale-[0.96]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Rifillo udhëtimin"]
					})
				]
			})
		]
	});
}
function Chrome({ phase, index, progress, muted, autoplay, onMute, onAutoplay, onPrev, onNext, onToc }) {
	const label = phase === "show" ? `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}` : phase === "toc" ? "Kujtesa" : phase === "outro" ? "Fundi" : "Hyrja";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute top-0 right-0 left-0 z-40 h-1 bg-border/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-gold transition-[width] duration-500 ease-out",
				style: { width: `${Math.round(progress * 100)}%` }
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "absolute top-4 right-4 left-4 z-40 flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-display text-[0.65rem] tracking-[0.22em] text-gold uppercase",
					children: SCHOOL
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "truncate text-[0.65rem] text-muted",
					children: [
						CLASS_NAME,
						" · ",
						label
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						label: muted ? "Ndize zërin" : "Hesht zërin",
						onClick: onMute,
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
					}),
					phase === "show" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						label: autoplay ? "Ndale" : "Luaj vetvetiu",
						onClick: onAutoplay,
						children: autoplay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						label: "Përmbajtja",
						onClick: onToc,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
					})
				]
			})]
		}),
		phase !== "intro" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-4 bottom-5 z-40 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onPrev,
				className: "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 border border-border bg-surface/90 px-3 text-parchment backdrop-blur-sm transition-transform duration-150 hover:border-gold/50 active:scale-[0.96]",
				"aria-label": "Prapa",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-display text-[0.65rem] tracking-widest uppercase sm:inline",
					children: "Prapa"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onNext,
				className: "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 border border-gold/40 bg-crimson/90 px-3 text-parchment transition-transform duration-150 hover:bg-crimson active:scale-[0.96]",
				"aria-label": "Para",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden font-display text-[0.65rem] tracking-widest uppercase sm:inline",
					children: phase === "outro" ? "Fundi" : "Para"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })]
			})]
		})
	] });
}
function TocOverlay({ current, onClose, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-50 overflow-y-auto bg-ink/92 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl text-parchment",
					children: "Përmbajtja"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
					label: "Mbyll",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-1",
				children: slides.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(i),
					className: cn("flex w-full items-center gap-3 border px-3 py-2.5 text-left transition-colors", i === current ? "border-gold bg-crimson/40" : "border-transparent hover:border-border hover:bg-surface"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-gold tabular-nums",
							children: String(s.studentNo).padStart(2, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-sm text-parchment",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs text-muted sm:inline",
							children: s.student
						})
					]
				}) }, s.id))
			})]
		})
	});
}
function IconBtn({ label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		title: label,
		onClick,
		className: "inline-flex size-11 items-center justify-center border border-border/80 bg-surface/70 text-parchment backdrop-blur-sm transition-transform duration-150 hover:border-gold/50 hover:text-gold active:scale-[0.96]",
		children
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Documentary, {});
}
//#endregion
export { Home as component };
