import {
  Gauge, Settings, Cog, Leaf, Handshake, Wrench, Truck, MapPin, Users, Factory, Gem, ShieldCheck, Headphones, Award, Clock,
  FileText, ClipboardList, Package, Wheat, Sprout, Zap, Target, Eye, HeartHandshake, ThumbsUp, Star, Hammer, HardHat, Building2,
  Warehouse, Fan, Flame, Droplets, Recycle, Globe, Phone, Mail, CheckCircle2, Trophy, Rocket, Lightbulb, BadgeCheck, Boxes,
  Container, Image, CircleDot,
} from 'lucide-react'

const MAP = {
  Gauge, Settings, Cog, Leaf, Handshake, Wrench, Truck, MapPin, Users, Factory, Gem, ShieldCheck, Headphones, Award, Clock,
  FileText, ClipboardList, Package, Wheat, Sprout, Zap, Target, Eye, HeartHandshake, ThumbsUp, Star, Hammer, HardHat, Building2,
  Warehouse, Fan, Flame, Droplets, Recycle, Globe, Phone, Mail, CheckCircle2, Trophy, Rocket, Lightbulb, BadgeCheck, Boxes,
  Container, Image,
}

// Curated icon set selectable in the admin panel
export const ICONS = Object.keys(MAP)

export default function Icon({ name, ...props }) {
  const C = MAP[name] || CircleDot
  return <C {...props} />
}
