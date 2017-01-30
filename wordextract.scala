import scala.io.Source
val out = new java.io.PrintWriter("cuss.json")
out.print("[")
val pattern = """(".*") :.*""".r
for(i<- Source.fromFile("words.json").getLines()) {
	val extract = util.Try {
		val pattern(j) = i
		j
	 } match {
	 	case util.Success(x) => x
	 	case _ => "]"
	 }
	out.println(extract+",")
}
out.close