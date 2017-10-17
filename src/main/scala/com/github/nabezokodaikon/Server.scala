package com.github.nabezokodaikon

import akka.actor.{ ActorRef, Props }
import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.ws.TextMessage
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{ HttpApp, Route }
import akka.http.scaladsl.server.directives._
import akka.stream.scaladsl.{ Flow, Sink, Source }
import com.github.nabezokodaikon.util.FileUtil
import com.typesafe.scalalogging.LazyLogging

class Server(manager: ActorRef) extends HttpApp with LazyLogging {

  private val contentsDirectory = {
    val current = FileUtil.getCurrentDirectory
    s"${current}/public"
  }

  private def createUser() = {
    val sink = Sink.ignore
    val source = Source.fromGraph(new ClientStage(manager))
      .map((value: UdpListener.OutgoingValue) => TextMessage(value.value))
    Flow.fromSinkAndSource(sink, source)
  }

  override def routes: Route =
    pathSingleSlash {
      get {
        val file = s"${contentsDirectory}/index.html"
        val contentType = FileUtil.getContentType(file)
        val text = FileUtil.readText(file)
        complete(HttpEntity(contentType, text))
      }
    } ~
      path("pcars1") {
        get {
          handleWebSocketMessages(createUser())
        }
      } ~
      path(Segments) { x: List[String] =>
        get {
          val segments = x.mkString("/")
          val file = s"${contentsDirectory}/${segments}"
          val contentType = FileUtil.getContentType(file)
          val text = FileUtil.readText(file)
          complete(HttpEntity(contentType, text))
        }
      }
}
