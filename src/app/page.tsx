"use client"

import React, { useRef, useEffect } from 'react'

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()

    class Particle {
      x: number
      y: number
      size: number
      targetX: number
      targetY: number
      color: string
      speed: number
      angle: number
      rising: boolean

      constructor(x: number, y: number, targetX: number, targetY: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 2 + 1
        this.targetX = targetX
        this.targetY = targetY
        this.color = `rgba(0, ${Math.floor(Math.random() * 55 + 200)}, ${Math.floor(Math.random() * 55 + 200)}, ${Math.random() * 0.3 + 0.5})`
        this.speed = Math.random() * 0.5 + 0.2
        this.angle = Math.random() * Math.PI * 2
        this.rising = false
      }

      update(time: number) {
        if (!this.rising && Math.random() < 0.01) {
          this.rising = true
        }

        if (this.rising) {
          const dx = this.targetX - this.x
          const dy = this.targetY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 1) {
            this.x += dx * this.speed * 0.01
            this.y += dy * this.speed * 0.01
          } else {
            this.x = this.targetX
            this.y = this.targetY
          }
        } else {
          this.y += Math.sin(this.angle + time * 2) * 0.2
        }
      }

      draw() {
        ctx!.fillStyle = this.color
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function createHeart() {
      const particles: Particle[] = []
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const size = Math.min(canvas.width, canvas.height) * 0.3

      for (let i = 0; i < 3000; i++) {
        const t = i / 3000 * Math.PI * 2
        const x = 16 * Math.pow(Math.sin(t), 3)
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        const targetX = centerX + x * size / 16
        const targetY = centerY + y * size / 16

        const startX = Math.random() * canvas.width
        const startY = canvas.height + Math.random() * 50 // Start below the canvas

        particles.push(new Particle(startX, startY, targetX, targetY))
      }

      return particles
    }

    let particles = createHeart()
    let time = 0

    function animate() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.01
      particles.forEach(particle => {
        particle.update(time)
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      setCanvasSize()
      particles = createHeart()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-screen bg-black"
    />
  )
}